package za.ac.cput.tekkiestorecapstone.service;

/* PaystackService.java
Starts Paystack (test mode) payments and, once Paystack confirms the money, turns the cart into an order
*/

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import za.ac.cput.tekkiestorecapstone.domain.*;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class PaystackService {

    private static final String API_URL = "https://api.paystack.co";
    // Paystack statuses that mean "not finished yet", so the frontend should check again
    private static final Set<String> STILL_PROCESSING = Set.of("ongoing", "pending", "processing", "queued");

    // Same shipping rule the checkout page shows
    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("1000.00");
    private static final BigDecimal SHIPPING_FEE = new BigDecimal("150.00");
    // The promo the cart offers: 10% off the subtotal, rounded to whole rands
    private static final String PROMO_CODE = "TEKKIE10";
    private static final BigDecimal PROMO_RATE = new BigDecimal("0.10");

    private final CustomerRepository customerRepo;
    private final CartItemRepository cartItemRepo;
    private final OrderRepository orderRepo;
    private final DeliveryDetailsRepository deliveryRepo;
    private final OrderService orderService;
    private final String secretKey;
    private final String frontendUrl;
    private final RestClient paystack;

    public PaystackService(CustomerRepository customerRepo, CartItemRepository cartItemRepo,
                           OrderRepository orderRepo, DeliveryDetailsRepository deliveryRepo,
                           OrderService orderService,
                           @Value("${paystack.secret-key}") String secretKey,
                           @Value("${paystack.frontend-url}") String frontendUrl) {
        this.customerRepo = customerRepo;
        this.cartItemRepo = cartItemRepo;
        this.orderRepo = orderRepo;
        this.deliveryRepo = deliveryRepo;
        this.orderService = orderService;
        this.secretKey = secretKey.trim();
        this.frontendUrl = frontendUrl.trim();
        // The secret key only ever travels from our backend to Paystack, never to the browser
        this.paystack = RestClient.builder()
                .baseUrl(API_URL)
                .defaultHeader("Authorization", "Bearer " + this.secretKey)
                .build();
    }

    // Optional checkout body, e.g. {"promoCode": "TEKKIE10"}
    public record CheckoutRequest(String promoCode) {
    }

    // What the frontend needs to send the shopper to Paystack
    public record Checkout(String orderId, String authorizationUrl) {
    }

    // status is PAID, PENDING (check again shortly) or FAILED (not paid)
    public record PaymentResult(String orderId, String status) {
    }

    // Delivery address from the checkout form
    public record Shipping(@NotBlank String fullName, @NotBlank String phone,
                           @NotBlank String streetNumber, @NotBlank String streetName, @NotBlank String suburb,
                           @NotBlank String city, @NotBlank String province, @NotBlank String postalCode) {
    }

    // The parts of Paystack's JSON replies we use
    @JsonIgnoreProperties(ignoreUnknown = true)
    record PaystackResponse(boolean status, String message, PaystackData data) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record PaystackData(@JsonProperty("authorization_url") String authorizationUrl,
                        String status, Long amount, String currency, Long id, PaystackCustomer customer,
                        Object metadata) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record PaystackCustomer(String email) {
    }

    // Nothing is saved here, so pressing Back or cancelling on Paystack changes nothing in our store
    @Transactional(readOnly = true)
    public Checkout createCheckout(String customerEmail, String promoCode) {
        if (secretKey.isBlank()) {
            throw new IllegalStateException("Paystack is not set up. Add PAYSTACK_SECRET_KEY to backend/env/.env");
        }

        Customer customer = findCustomer(customerEmail);
        // Each customer's cart id is their customer id
        List<CartItem> cartItems = cartItemRepo.findByCart_CartId(customer.getCustomerId());
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Your cart is empty");
        }

        String promo = validPromo(promoCode);
        String orderId = "TK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal total = buildOrder(orderId, customer, cartItems, promo).getTotalAmount();
        return new Checkout(orderId, startTransaction(customer.getEmail(), toCents(total), orderId, promo));
    }

    // Being sent back from Paystack proves nothing, so we ask Paystack before creating the order
    @Transactional
    public PaymentResult confirmPayment(String orderId, String customerEmail, Shipping shipping) {
        // Already confirmed before (e.g. the page was refreshed), so don't create it twice
        Order existing = orderRepo.findById(orderId).orElse(null);
        if (existing != null) {
            if (!existing.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
                throw new IllegalArgumentException("Order not found");
            }
            return new PaymentResult(orderId, "PAID");
        }

        PaystackData transaction = fetchTransaction(orderId);
        // Only the customer who started this payment can confirm it
        if (transaction.customer() == null || !customerEmail.equalsIgnoreCase(transaction.customer().email())) {
            throw new IllegalArgumentException("Order not found");
        }
        if (!"success".equals(transaction.status())) {
            return new PaymentResult(orderId, STILL_PROCESSING.contains(transaction.status()) ? "PENDING" : "FAILED");
        }

        Customer customer = findCustomer(customerEmail);
        List<CartItem> cartItems = cartItemRepo.findByCart_CartId(customer.getCustomerId());
        // The promo code was stored on the Paystack transaction when the payment started
        Order order = buildOrder(orderId, customer, cartItems, promoFrom(transaction.metadata()));
        // What was paid must match the cart exactly, in rands
        if (cartItems.isEmpty() || transaction.amount() == null
                || transaction.amount() != toCents(order.getTotalAmount()) || !"ZAR".equals(transaction.currency())) {
            return new PaymentResult(orderId, "FAILED");
        }

        // Order, delivery details, stock and cart all change together, or not at all
        Order saved = orderRepo.save(new Order.Builder()
                .copy(order)
                .setPaymentReference(String.valueOf(transaction.id()))
                .build());
        deliveryRepo.save(deliveryDetails(saved, customer, shipping));
        order.getOrderItems().forEach(orderService::decreaseVariantStock);
        cartItemRepo.deleteAll(cartItems);
        return new PaymentResult(orderId, "PAID");
    }

    // Builds the order from the cart. Prices come from the database, never from the browser.
    private Order buildOrder(String orderId, Customer customer, List<CartItem> cartItems, String promo) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Shoe shoe = cartItem.getShoe();
            BigDecimal price = shoe.isOnSale() ? shoe.getSalePrice() : shoe.getBasePrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            orderItems.add(new OrderItem.Builder()
                    .setOrderItemId(orderId + "-" + (orderItems.size() + 1))
                    .setShoeId(shoe.getShoeId())
                    .setShoeName(shoe.getShoeName())
                    .setBrand(shoe.getBrand())
                    .setSize(sizeLabel(cartItem))
                    .setImageUrl(shoe.getImageUrls() == null || shoe.getImageUrls().isEmpty() ? "" : shoe.getImageUrls().get(0))
                    .setQuantity(cartItem.getQuantity())
                    .setUnitPrice(price)
                    .setSubTotal(lineTotal)
                    .build());
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
        BigDecimal discount = promo == null ? BigDecimal.ZERO : subtotal.multiply(PROMO_RATE).setScale(0, RoundingMode.HALF_UP);
        Order order = new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(new Date())
                .setSubtotal(subtotal)
                .setShippingFee(shippingFee)
                .setDiscount(discount)
                .setTotalAmount(subtotal.subtract(discount).add(shippingFee).setScale(2, RoundingMode.HALF_UP))
                .setPaymentMethod("PAYSTACK")
                .setStatus(OrderStatus.PAID)
                .setCustomer(customer)
                .build();

        // Link each item to its order so JPA saves them together (same approach as OrderService.create)
        List<OrderItem> linkedItems = new ArrayList<>();
        for (OrderItem item : orderItems) {
            linkedItems.add(new OrderItem.Builder().copy(item).setOrder(order).build());
        }
        return new Order.Builder().copy(order).setOrderItems(linkedItems).build();
    }

    private DeliveryDetails deliveryDetails(Order order, Customer customer, Shipping shipping) {
        // Estimated delivery: 3 business days from today
        LocalDate estimate = LocalDate.now();
        for (int added = 0; added < 3; ) {
            estimate = estimate.plusDays(1);
            if (estimate.getDayOfWeek() != DayOfWeek.SATURDAY && estimate.getDayOfWeek() != DayOfWeek.SUNDAY) {
                added++;
            }
        }

        return new DeliveryDetails.Builder()
                .setDeliveryId("DD-" + order.getOrderId())
                .setOrder(order)
                .setCustomer(customer)
                .setAddress(new Address.Builder()
                        .setStreetNumber(shipping.streetNumber().trim())
                        .setStreetName(shipping.streetName().trim())
                        .setSuburb(shipping.suburb().trim())
                        .setCity(shipping.city().trim())
                        .setProvince(shipping.province().trim())
                        .setPostalCode(shipping.postalCode().trim())
                        .build())
                .setFullName(shipping.fullName().trim())
                .setPhone(shipping.phone().trim())
                .setCourier("DSV Express Logistics")
                .setTrackingNumber("DSV-ZA-" + (10000000 + new Random().nextInt(90000000)))
                .setEstimatedDeliveryDate(estimate)
                .setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();
    }

    // Package-private so tests can replace the real call to Paystack
    String startTransaction(String email, long amountInCents, String orderId, String promo) {
        Map<String, Object> metadata = new HashMap<>();
        // Where Paystack sends the shopper if they press "Cancel Payment"
        metadata.put("cancel_action", frontendUrl + "/payment/cancel/" + orderId);
        // Kept on the transaction so confirming the payment works out the same discount
        if (promo != null) {
            metadata.put("promo_code", promo);
        }
        Map<String, Object> body = Map.of(
                "email", email,
                "amount", amountInCents,
                "currency", "ZAR",
                "reference", orderId,
                "callback_url", frontendUrl + "/payment/return/" + orderId,
                "metadata", metadata);

        return send(paystack.post().uri("/transaction/initialize")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)).authorizationUrl();
    }

    // Package-private so tests can replace the real call to Paystack
    PaystackData fetchTransaction(String orderId) {
        return send(paystack.get().uri("/transaction/verify/{reference}", orderId));
    }

    private PaystackData send(RestClient.RequestHeadersSpec<?> request) {
        PaystackResponse response;
        try {
            response = request.exchange((req, res) -> res.bodyTo(PaystackResponse.class));
        } catch (RestClientException e) {
            throw new IllegalStateException("Could not reach Paystack. Please try again.", e);
        }
        // Paystack explains what went wrong in "message", e.g. "Invalid key"
        if (response == null || !response.status() || response.data() == null) {
            throw new IllegalStateException("Paystack: " + (response == null ? "no response" : response.message()));
        }
        return response.data();
    }

    private Customer findCustomer(String email) {
        return customerRepo.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Customer not found"));
    }

    // null when no code was entered; any code other than ours is refused
    private static String validPromo(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        if (!PROMO_CODE.equalsIgnoreCase(code.trim())) {
            throw new IllegalArgumentException("That promo code isn't valid");
        }
        return PROMO_CODE;
    }

    // Paystack returns metadata as an object, or an empty string when there is none
    private static String promoFrom(Object metadata) {
        return metadata instanceof Map<?, ?> map && PROMO_CODE.equals(map.get("promo_code")) ? PROMO_CODE : null;
    }

    // Paystack works in cents: R1200.00 -> 120000
    private static long toCents(BigDecimal rands) {
        return rands.movePointRight(2).setScale(0, RoundingMode.HALF_UP).longValueExact();
    }

    // e.g. "UK 9" or "UK 9.5", the format OrderService uses to find the variant to reduce stock
    private static String sizeLabel(CartItem cartItem) {
        ShoeSize size = cartItem.getShoeSize() != null ? cartItem.getShoeSize()
                : cartItem.getShoeVariant() != null ? cartItem.getShoeVariant().getSize() : null;
        if (size == null) {
            return "";
        }
        return size.getSizeRegion() + " " + BigDecimal.valueOf(size.getSizeValue()).stripTrailingZeros().toPlainString();
    }
}
