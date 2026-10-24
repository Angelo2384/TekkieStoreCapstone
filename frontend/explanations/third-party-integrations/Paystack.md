# Paystack Integration (Test Mode)

**What is it?**  
Paystack is a payment gateway (owned by Stripe) that works in South Africa with rands. We use its **test mode**: the checkout page looks and behaves like a real one (card form, bank PIN and OTP steps) but **no real money moves**. The shopper types their card details on Paystack's page, so **our store never sees or stores card details**.

**The main rule: no payment, no order.**  
Nothing is saved when the shopper clicks Pay. The order only exists once Paystack confirms the money. Pressing Back, cancelling on Paystack or closing the tab leaves the cart and order history exactly as they were.

**How a payment works (step by step):**

1. The shopper fills in their delivery address on `/checkout` and clicks **Pay with Paystack**.
2. The frontend calls `POST /payments/paystack/checkout`. The backend:
   - finds the logged-in customer from their JWT token,
   - works out the total from **their cart in the database** (prices come from the database, not the browser),
   - asks Paystack to start a payment for that amount and returns Paystack's checkout link. **Nothing is saved in our database.**
3. The shopper pays on Paystack's page with a test card (or presses Back/Cancel, and nothing changes).
4. Paystack sends the shopper back to `/payment/return/{orderId}`. That page calls `POST /payments/paystack/verify/{orderId}` with the delivery address.
5. The backend **asks Paystack directly** (using our secret key) whether that payment succeeded, checks it was made by this customer, and that the amount matches their cart in rands. Only then, all in one step:
   - the order is created as `PAID` (with Paystack's transaction ID as the payment reference),
   - the delivery details are saved,
   - stock is reduced,
   - the cart is emptied.

> Being sent back to the return page does **not** prove the shopper paid (anyone can type that URL). Only step 5, where our backend checks with Paystack itself, can create an order.

**Where is it integrated?**

1. **`application.properties` / `backend/env/.env`:** the Paystack test secret key (`PAYSTACK_SECRET_KEY`).
2. **`PaystackService.java` (in the `service` package):** starts payments and, once Paystack confirms one, creates the order and delivery details.
3. **`PaystackController.java` (in the `controller` package):** the two endpoints, `/checkout` and `/verify/{orderId}`.
4. **`JwtAuthFilter.java` + `SecurityConfig.java` (in the `security` package):** read the login token so the backend knows who is paying, and lock down who may change orders.
5. **Frontend:** `services/paymentService.ts`, `pages/CheckoutPage.tsx`, `components/checkout/PaymentMethodSection.tsx` and `pages/PaymentReturn.tsx`.

**How we keep it secure:**

| Risk | What stops it |
|---|---|
| Shopper changes the price in the browser | The backend calculates the total from the database |
| Someone pretends they paid | The backend asks Paystack directly with our secret key; the amount and currency must also match the cart |
| Pressing Back / cancelling leaves junk orders | Nothing is saved until the payment is confirmed |
| The secret key leaking | It only lives in the backend `.env` and is only sent to Paystack, never to the browser |
| Someone marks their own order as `PAID` | `/order/create`, `/order/update` and `/order/delete` are admin-only |
| Confirming someone else's payment | The customer comes from the signed JWT and must match the email Paystack has for that payment |
| The same payment confirmed twice (refresh, double click) | If the order already exists we just report `PAID`; the order ID is unique, so it can't be created twice |
| Card details leaking | We never collect them; Paystack does |

**Running it locally:**

1. Create a free account at [paystack.com](https://paystack.com) and choose **South Africa** as the country (so payments are in rands).
2. In the dashboard go to **Settings > API Keys & Webhooks** and copy the **Test Secret Key** (starts with `sk_test_`).
3. Put it in `backend/env/.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_...
   ```
4. Start the backend and the frontend. No tunnel (ngrok) is needed.
5. Log in, add shoes to the cart, check out, and pay with a test card:

| Card | CVV | Extra steps |
|---|---|---|
| 4084 0840 8408 4081 | 408 | None, pays straight away |
| 5060 6666 6666 6666 666 | 123 | PIN `1234`, then OTP `123456` |

Any future expiry date works.

**Known limitation:** if a shopper pays and then closes the tab before returning to our site, no order is created and the shoes stay in their cart, even though Paystack took the (test) money. A real store would also listen for Paystack's webhook to cover this, but that needs a public URL, so we left it out of the capstone.

**Reference / How we figured this out:**  
We followed Paystack's developer documentation for initializing and verifying transactions, and its test-card list.  
Links: [Accept Payments](https://paystack.com/docs/payments/accept-payments/), [Verify Payments](https://paystack.com/docs/payments/verify-payments/), [Test Payments](https://paystack.com/docs/payments/test-payments/)
