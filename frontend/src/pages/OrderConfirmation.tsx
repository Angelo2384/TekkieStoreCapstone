import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Truck,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Package,
} from 'lucide-react';
import { useOrder, Order } from '../context/OrderContext';
import { formatPrice } from '../utils/formatters';
import { ProductImage } from '../components/shared/ProductImage';
import './OrderConfirmation.css';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { getOrderById, fetchOrderById } = useOrder();
  const [loadedOrder, setLoadedOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    if (orderId) {
      const existing = getOrderById(orderId);
      if (existing) {
        setLoadedOrder(existing);
      } else {
        fetchOrderById(orderId).then((res) => {
          if (res) setLoadedOrder(res);
        });
      }
    }
  }, [orderId, getOrderById, fetchOrderById]);

  // Find order by param or activeOrder, or fallback to demo order if directly navigated
  const [isLoading, setIsLoading] = React.useState(true);
  // Resolve order based on URL param
  const resolveOrder = async () => {
    if (!orderId) {
      // No orderId in URL – redirect to cart
      navigate('/cart');
      return;
    }
    // Try to get from context first
let ord = getOrderById(orderId) || loadedOrder;
if (!ord) {
  // Fetch from backend if not present in context
  ord = (await fetchOrderById(orderId)) ?? null;
}
if (!ord) {
  // Invalid or not yet created – redirect
  navigate('/cart');
  return;
}
setLoadedOrder(ord as Order);
setIsLoading(false);
  };

  React.useEffect(() => {
    resolveOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // While loading, show a simple indicator
  if (isLoading) {
    return (
      <div className="order-confirmation-page">
        <section className="confirmation-hero-section">
          <div className="confirmation-container">
            <div className="confirmation-hero-content">
              <h2>Loading order details...</h2>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // At this point we have a valid order
  const order = loadedOrder as Order;


  // Printable / downloadable clean invoice
  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download or print your invoice.');
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px 8px; font-weight: 600;">${item.name} (${item.brand})<br/><span style="font-size: 12px; color: #666;">Size: ${item.size}</span></td>
          <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">${formatPrice(item.price)}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 700;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TekkieStore Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1F2937; margin: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #FD6701; padding-bottom: 20px; }
            .brand { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #0B0D14; }
            .brand span { color: #FD6701; }
            .meta { font-size: 14px; text-align: right; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .box { background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; }
            .box-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6B7280; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px 8px; background: #0B0D14; color: #fff; font-size: 12px; text-transform: uppercase; }
            .totals { margin-top: 20px; width: 300px; margin-left: auto; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .grand-total { border-top: 2px solid #FD6701; padding-top: 10px; font-size: 18px; font-weight: 800; color: #FD6701; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">TEKKIE<span>STORE</span></div>
            <div class="meta">
              <strong>OFFICIAL RECEIPT</strong><br/>
              Order Ref: ${order.orderNumber}<br/>
              Date: ${order.dateFormatted}
            </div>
          </div>
          <div class="details-grid">
            <div class="box">
              <div class="box-title">Delivered To</div>
              <strong>${order.shippingAddress.recipientName}</strong><br/>
              ${order.shippingAddress.streetNumber} ${order.shippingAddress.streetName}<br/>
              ${order.shippingAddress.suburb}, ${order.shippingAddress.city}<br/>
              ${order.shippingAddress.province}, ${order.shippingAddress.postalCode}<br/>
              South Africa
            </div>
            <div class="box">
              <div class="box-title">Dispatch &amp; Payment Details</div>
              Courier: ${order.shippingMethod}<br/>
              Tracking Ref: ${order.trackingNumber}<br/>
              Payment Method: ${order.paymentMethod === 'PAYSTACK' ? 'Paystack (Test mode)' : order.paymentMethod === 'card' ? 'Credit / Debit Card' : 'Instant EFT'}<br/>
              Payment Ref: ${order.paymentReference}<br/>
              Estimated Arrival: ${order.estimatedArrival}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="totals">
            <div class="totals-row"><span>Subtotal:</span><span>${formatPrice(order.subtotal)}</span></div>
            ${(order.discount || 0) > 0 ? `<div class="totals-row"><span>Discount:</span><span>-${formatPrice(order.discount)}</span></div>` : ''}
            <div class="totals-row"><span>Shipping:</span><span>${order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span></div>
            <div class="totals-row grand-total"><span>TOTAL:</span><span>${formatPrice(order.total)}</span></div>
          </div>
          <div class="footer">Thank you for shopping with TekkieStore. For support, contact support@tekkiestore.co.za</div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  const handleTrackMyOrder = () => {
    navigate(order?.id ? `/delivery-details/${order.id}` : '/delivery-details');
  };

  const handleContinueShopping = () => {
    navigate('/catalogue');
  };

  return (
    <div className="order-confirmation-page">
      <section className="confirmation-hero-section">
        <div className="confirmation-container">
          <div className="confirmation-hero-content">
            <span className="confirmation-eyebrow">ORDER STATUS &amp; RECEIPT</span>
            <h1 className="confirmation-main-title">ORDER CONFIRMED</h1>
            <p className="confirmation-hero-subtitle">
              Thank you for your purchase. We've sent a confirmation email with all your order details and live tracking information.
            </p>
          </div>
        </div>
      </section>

      <div className="confirmation-container">
        <div className="confirmation-breadcrumb-bar">
          <nav className="confirmation-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Order Confirmation</span>
          </nav>
        </div>
      </div>

      <main className="confirmation-body-section">
        <div className="confirmation-container">
          <div className="order-info-horizontal-bar" aria-label="Order summary details">
            <div className="order-info-unit">
              <span className="info-unit-label">ORDER NUMBER</span>
              <span className="info-unit-value order-num-val">{order.orderNumber}</span>
            </div>
            <div className="order-info-divider" />
            <div className="order-info-unit">
              <span className="info-unit-label">ORDER DATE</span>
              <span className="info-unit-value">{order.dateFormatted}</span>
            </div>
            <div className="order-info-divider" />
            <div className="order-info-unit">
              <span className="info-unit-label">PAYMENT REF</span>
              <span className="info-unit-value">{order.paymentReference}</span>
            </div>
            <div className="order-info-divider" />
            <div className="order-info-unit">
              <span className="info-unit-label">TOTAL AMOUNT</span>
              <span className="info-unit-value total-amount-val">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="confirmation-layout-grid">
            <div className="confirmation-left-col">
              {/* Order Summary Card */}
              <div className="confirm-card order-summary-card" aria-label="Order Summary">
                <div className="confirm-card-header">
                  <h2 className="confirm-card-title">ORDER SUMMARY</h2>
                  <span className="summary-items-count-badge">
                    {order.itemsCount} {order.itemsCount === 1 ? 'ITEM' : 'ITEMS'}
                  </span>
                </div>

                {/* Purchased Products List */}
                <div className="purchased-items-list" role="list">
                  {order.items.map((item) => (
                    <div key={item.id} className="purchased-item-row" role="listitem">
                      <div className="item-image-wrapper">
                        <ProductImage src={item.image} alt={item.name} className="item-product-thumb" />
                        <span className="item-qty-tag">{item.quantity}</span>
                      </div>

                      <div className="item-main-details">
                        <h3 className="item-title">{item.name}</h3>
                        <div className="item-sub-meta">
                          <span className="item-brand">{item.brand}</span>
                          <span className="meta-bullet">•</span>
                          <span className="item-size">Size: {item.size}</span>
                        </div>
                      </div>

                      <div className="item-price-block">
                        <span className="item-price-val">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="item-price-unit">{formatPrice(item.price)} each</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-section-divider" />

                {/* Totals Breakdown */}
                <div className="order-financials-table">
                  <div className="fin-row">
                    <span className="fin-title">Subtotal</span>
                    <span className="fin-data">{formatPrice(order.subtotal)}</span>
                  </div>

                  {(order.discount || 0) > 0 && (
                    <div className="fin-row">
                      <span className="fin-title">Discount</span>
                      <span className="fin-data">-{formatPrice(order.discount)}</span>
                    </div>
                  )}

                  <div className="fin-row">
                    <span className="fin-title">Shipping</span>
                    <span className="fin-data">
                      {order.shippingFee === 0 ? (
                        <span className="free-express-badge">FREE (EXPRESS AIR)</span>
                      ) : (
                        formatPrice(order.shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="summary-section-divider thick" />

                  <div className="fin-row total-highlight-row">
                    <span className="final-total-label">TOTAL</span>
                    <span className="final-total-val">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="confirmation-right-col">
              {/* Delivery Card */}
              <div className="confirm-card delivery-info-card" aria-label="Delivery information">
                <div className="confirm-card-header">
                  <h2 className="confirm-card-title">DELIVERY</h2>
                </div>

                <div className="delivery-card-content">
                  {/* Estimated Arrival */}
                  <div className="delivery-unit arrival-unit">
                    <div className="delivery-unit-icon-wrap">
                      <Calendar size={18} />
                    </div>
                    <div className="delivery-unit-text">
                      <span className="delivery-unit-label">ESTIMATED ARRIVAL</span>
                      <span className="delivery-unit-value arrival-val">{order.estimatedArrival}</span>
                    </div>
                  </div>

                  {/* Shipping To */}
                  <div className="delivery-unit shipping-to-unit">
                    <div className="delivery-unit-icon-wrap">
                      <MapPin size={18} />
                    </div>
                    <div className="delivery-unit-text">
                      <span className="delivery-unit-label">SHIPPING TO</span>
                      <div className="delivery-address-block">
                        <strong className="recipient-name">
                          {order.shippingAddress.recipientName}
                        </strong>
                        <p className="address-line">
                          {order.shippingAddress.streetNumber} {order.shippingAddress.streetName}
                        </p>
                        <p className="address-line">
                          {order.shippingAddress.suburb}, {order.shippingAddress.city}
                        </p>
                        <p className="address-line">
                          {order.shippingAddress.province}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="address-line country">South Africa</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method Highlighted Section */}
                  <div className="delivery-method-highlight-box">
                    <div className="method-left-accent" />
                    <div className="method-box-content">
                      <div className="method-header-row">
                        <span className="method-badge-icon">
                          <Truck size={16} />
                        </span>
                        <strong className="method-title">{order.shippingMethod}</strong>
                      </div>
                      <p className="method-subtitle">
                        Estimated Dispatch within 24 hours with full tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="confirmation-actions-group">
                <button
                  type="button"
                  className="btn-track-my-order"
                  onClick={handleTrackMyOrder}
                  aria-label="Track My Order"
                >
                  <Package size={18} />
                  <span>TRACK MY ORDER</span>
                </button>

                <button
                  type="button"
                  className="btn-continue-shopping-orange"
                  onClick={handleContinueShopping}
                  aria-label="Continue Shopping"
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn-download-receipt-link"
                  onClick={handleDownloadInvoice}
                  aria-label="Download PDF Invoice or Receipt"
                >
                  <Download size={15} />
                  <span>Download PDF Invoice / Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
