import React, { useState } from 'react';
import { Check, Clock, Truck, Package, MapPin, Copy, CheckCircle2 } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import './TrackingStatus.css';

export type OrderTrackingStatus =
  | 'ORDER_CONFIRMED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

interface TrackingStageConfig {
  key: OrderTrackingStatus;
  title: string;
  icon: React.ReactNode;
  activeDescription: string;
  inactiveDescription: string;
}

const TRACKING_STAGES: TrackingStageConfig[] = [
  {
    key: 'ORDER_CONFIRMED',
    title: 'Order Confirmed',
    icon: <Check size={16} />,
    activeDescription: 'Order placed and payment verified successfully.',
    inactiveDescription: 'Order confirmation pending.',
  },
  {
    key: 'PACKED',
    title: 'Packed & Quality Checked',
    icon: <Package size={16} />,
    activeDescription: 'Shoes inspected, boxed, and quality checked.',
    inactiveDescription: 'Packaging and quality inspection.',
  },
  {
    key: 'DISPATCHED',
    title: 'Dispatched & In Transit',
    icon: <Truck size={16} />,
    activeDescription: 'Handed over to express courier and in transit.',
    inactiveDescription: 'Courier dispatch and transport.',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    title: 'Out for Delivery',
    icon: <Clock size={16} />,
    activeDescription: 'Assigned to courier van for doorstep delivery.',
    inactiveDescription: 'Final local delivery route.',
  },
  {
    key: 'DELIVERED',
    title: 'Delivered',
    icon: <MapPin size={16} />,
    activeDescription: 'Package successfully delivered and received.',
    inactiveDescription: 'Doorstep drop-off and recipient receipt.',
  },
];

const STAGE_KEYS: OrderTrackingStatus[] = [
  'ORDER_CONFIRMED',
  'PACKED',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const TrackingStatus: React.FC = () => {
  const { activeOrder } = useOrder();
  const [copied, setCopied] = useState(false);

  // Status mapping ready for future backend integration (defaults to 'ORDER_CONFIRMED')
  const currentStatus: OrderTrackingStatus = 'ORDER_CONFIRMED';
  const currentStageIndex = STAGE_KEYS.indexOf(currentStatus);

  const trackingNumber = activeOrder?.trackingNumber || '';
  const orderDate = activeOrder?.dateFormatted || '';

  const handleCopyTracking = () => {
    if (!trackingNumber || trackingNumber === '—') return;
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tracking-status-card">
      <div className="tracking-status-header">
        <div className="tracking-header-left">
          <div className="tracking-badge-row">
            <span className="tracking-status-pill order-confirmed">
              <span className="pulse-dot" />
              ORDER CONFIRMED
            </span>
            <span className="estimated-pill">
              Estimated Delivery: <strong>—</strong>
            </span>
          </div>
          <h2 className="tracking-title">Live Tracking Progress</h2>
          <p className="tracking-subtitle">
            Your order has been confirmed.
          </p>
        </div>

        <div className="tracking-header-right">
          <div className="tracking-number-box">
            <span className="tracking-label">Tracking Number</span>
            <div className="tracking-value-row">
              <span className="tracking-id">{trackingNumber || '—'}</span>
              <button
                type="button"
                className={`btn-copy-tracking ${copied ? 'copied' : ''}`}
                onClick={handleCopyTracking}
                disabled={!trackingNumber || trackingNumber === '—'}
                title={trackingNumber && trackingNumber !== '—' ? 'Copy tracking number to clipboard' : 'Tracking number pending'}
                aria-label="Copy tracking number"
              >
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE PROGRESS STEPS */}
      <div className="tracking-timeline-wrapper">
        <div className="tracking-steps-container">
          {TRACKING_STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const statusClass = isCompleted ? 'step-completed' : 'step-upcoming';
            const isConnectorActive = idx < currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`tracking-step-item ${statusClass}`}
              >
                {/* Connector line between steps */}
                {idx < TRACKING_STAGES.length - 1 && (
                  <div
                    className={`step-connector ${
                      isConnectorActive ? 'connector-active' : ''
                    }`}
                  />
                )}

                {/* Step Circle Indicator - Always renders the stage icon */}
                <div className="step-circle-wrap">
                  <div className="step-circle" title={stage.title}>
                    {stage.icon}
                  </div>
                </div>

                {/* Step Details */}
                <div className="step-content">
                  {isCompleted && orderDate && idx === 0 && (
                    <div className="step-header-meta">
                      <span className="step-time">{orderDate}</span>
                    </div>
                  )}
                  <h3 className="step-title">{stage.title}</h3>
                  <p className="step-desc">
                    {isCompleted ? stage.activeDescription : stage.inactiveDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tracking-pending-notice">
          <p>Remaining tracking information will appear when provided by the backend.</p>
        </div>
      </div>
    </div>
  );
};
