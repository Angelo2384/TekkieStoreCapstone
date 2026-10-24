package za.ac.cput.tekkiestorecapstone.service;

/* PaystackServiceTest.java
Tests for starting and confirming Paystack payments
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.*;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class PaystackServiceTest {

    private static final PaystackService.Shipping SHIPPING = new PaystackService.Shipping(
            "Sam Smith", "0821234567", "12", "Main Road", "Claremont", "Cape Town", "Western Cape", "7708");

    @Mock
    CustomerRepository customerRepo;

    @Mock
    CartItemRepository cartItemRepo;

    @Mock
    OrderRepository orderRepo;

    @Mock
    DeliveryDetailsRepository deliveryRepo;

    @Mock
    OrderService orderService;

    private PaystackService service;
    private long chargedCents;
    private PaystackService.PaystackData paystackSays;
    private Customer customer;
    private List<CartItem> cart;

    @BeforeEach
    void setUp() {
        // Replaces the real HTTP calls to Paystack
        service = new PaystackService(customerRepo, cartItemRepo, orderRepo, deliveryRepo, orderService,
                "sk_test_dummy", "http://localhost:5173") {
            @Override
            String startTransaction(String email, long amountInCents, String orderId) {
                chargedCents = amountInCents;
                return "https://checkout.paystack.com/test123";
            }

            @Override
            PaystackData fetchTransaction(String orderId) {
                return paystackSays;
            }
        };
        customer = new Customer.Builder()
                .setCustomerId("C1")
                .setEmail("shopper@test.com")
                .setName(new Name.Builder().setFirstName("Sam").setLastName("Smith").build())
                .build();

        // 2 x sale price R600 = R1200, which qualifies for free shipping
        Shoe shoe = new Shoe.Builder()
                .setShoeId("NIKE-001").setBrand("Nike").setShoeName("Air Max")
                .setBasePrice(BigDecimal.valueOf(800)).setSalePrice(BigDecimal.valueOf(600))
                .setSalePercentage(BigDecimal.valueOf(25))
                .build();
        cart = List.of(new CartItem.Builder()
                .setCartItemId("CI1").setShoe(shoe).setQuantity(2)
                .setShoeSize(new ShoeSize.Builder().setSizeValue(9).setSizeRegion("UK").build())
                .build());
    }

    @Test
    void a_checkout_chargesDatabasePrices_andSavesNothing() {
        when(customerRepo.findByEmail("shopper@test.com")).thenReturn(Optional.of(customer));
        when(cartItemRepo.findByCart_CartId("C1")).thenReturn(cart);

        PaystackService.Checkout checkout = service.createCheckout("shopper@test.com");

        assertEquals(120000, chargedCents);
        assertEquals("https://checkout.paystack.com/test123", checkout.authorizationUrl());
        // Pressing Back on Paystack must leave no trace, so no order exists yet
        verify(orderRepo, never()).save(any());
        verify(deliveryRepo, never()).save(any());
    }

    @Test
    void b_checkout_emptyCart_isRejected() {
        when(customerRepo.findByEmail("shopper@test.com")).thenReturn(Optional.of(customer));
        when(cartItemRepo.findByCart_CartId("C1")).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.createCheckout("shopper@test.com"));
    }

    @Test
    void c_confirm_successfulPayment_createsPaidOrderAndClearsCart() {
        when(orderRepo.findById("TK-TEST1")).thenReturn(Optional.empty());
        when(customerRepo.findByEmail("shopper@test.com")).thenReturn(Optional.of(customer));
        when(cartItemRepo.findByCart_CartId("C1")).thenReturn(cart);
        when(orderRepo.save(any())).thenAnswer(call -> call.getArgument(0));
        paystackSays = transaction("success", 120000L, "shopper@test.com");

        assertEquals("PAID", service.confirmPayment("TK-TEST1", "shopper@test.com", SHIPPING).status());

        ArgumentCaptor<Order> order = ArgumentCaptor.forClass(Order.class);
        verify(orderRepo).save(order.capture());
        assertEquals(OrderStatus.PAID, order.getValue().getStatus());
        assertEquals("555", order.getValue().getPaymentReference());
        assertEquals("UK 9", order.getValue().getOrderItems().get(0).getSize());

        ArgumentCaptor<DeliveryDetails> delivery = ArgumentCaptor.forClass(DeliveryDetails.class);
        verify(deliveryRepo).save(delivery.capture());
        assertEquals("DD-TK-TEST1", delivery.getValue().getDeliveryId());
        assertEquals("Cape Town", delivery.getValue().getAddress().getCity());

        verify(orderService).decreaseVariantStock(any());
        verify(cartItemRepo).deleteAll(cart);
    }

    @Test
    void d_confirm_wrongAmount_createsNoOrder() {
        when(orderRepo.findById("TK-TEST1")).thenReturn(Optional.empty());
        when(customerRepo.findByEmail("shopper@test.com")).thenReturn(Optional.of(customer));
        when(cartItemRepo.findByCart_CartId("C1")).thenReturn(cart);
        paystackSays = transaction("success", 500L, "shopper@test.com");

        assertEquals("FAILED", service.confirmPayment("TK-TEST1", "shopper@test.com", SHIPPING).status());
        verify(orderRepo, never()).save(any());
        verify(cartItemRepo, never()).deleteAll(any());
    }

    @Test
    void e_confirm_notPaidOrStillProcessing_createsNoOrder() {
        when(orderRepo.findById("TK-TEST1")).thenReturn(Optional.empty());

        paystackSays = transaction("abandoned", 120000L, "shopper@test.com");
        assertEquals("FAILED", service.confirmPayment("TK-TEST1", "shopper@test.com", SHIPPING).status());

        paystackSays = transaction("ongoing", 120000L, "shopper@test.com");
        assertEquals("PENDING", service.confirmPayment("TK-TEST1", "shopper@test.com", SHIPPING).status());

        verify(orderRepo, never()).save(any());
    }

    @Test
    void f_confirm_someoneElsesPayment_isRejected() {
        when(orderRepo.findById("TK-TEST1")).thenReturn(Optional.empty());
        paystackSays = transaction("success", 120000L, "shopper@test.com");

        assertThrows(IllegalArgumentException.class,
                () -> service.confirmPayment("TK-TEST1", "someone.else@test.com", SHIPPING));
        verify(orderRepo, never()).save(any());
    }

    @Test
    void g_confirm_alreadyConfirmed_doesNotCreateItTwice() {
        Order paid = new Order.Builder().setOrderId("TK-TEST1").setCustomer(customer).setStatus(OrderStatus.PAID).build();
        when(orderRepo.findById("TK-TEST1")).thenReturn(Optional.of(paid));

        assertEquals("PAID", service.confirmPayment("TK-TEST1", "shopper@test.com", SHIPPING).status());
        verify(orderRepo, never()).save(any());
        verify(orderService, never()).decreaseVariantStock(any());
    }

    private PaystackService.PaystackData transaction(String status, Long amount, String email) {
        return new PaystackService.PaystackData(null, status, amount, "ZAR", 555L,
                new PaystackService.PaystackCustomer(email));
    }
}
