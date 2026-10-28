package za.ac.cput.tekkiestorecapstone.controller;

/* PaystackController.java
Endpoints for paying with Paystack (test mode)
*/

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.service.PaystackService;

import java.util.Map;

@RestController
@RequestMapping("/payments/paystack")
public class PaystackController {

    private final PaystackService service;

    public PaystackController(PaystackService service) {
        this.service = service;
    }

    // The customer comes from their login token, so they can only ever pay for their own cart
    // Optional body {"promoCode": "TEKKIE10"}; the backend checks the code and works out the discount itself
    @PostMapping("/checkout")
    public PaystackService.Checkout checkout(Authentication authentication,
                                             @RequestBody(required = false) PaystackService.CheckoutRequest request) {
        return service.createCheckout(authentication.getName(), request == null ? null : request.promoCode());
    }

    // Creates the order (with its delivery address) only if Paystack confirms the payment
    @PostMapping("/verify/{orderId}")
    public PaystackService.PaymentResult verify(@PathVariable String orderId, Authentication authentication,
                                                @Valid @RequestBody PaystackService.Shipping shipping) {
        return service.confirmPayment(orderId, authentication.getName(), shipping);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handlePaystackProblem(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("message", e.getMessage()));
    }
}
