import React from 'react';

export interface OrderQueueCounts {
  all: number;
  PENDING: number;
  PAID: number;
  PACKED: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

interface OrderQueueStripProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  counts: OrderQueueCounts;
}

interface QueueItem {
  id: string;
  label: string;
  countKey: keyof OrderQueueCounts;
}

const QUEUE_ITEMS: QueueItem[] = [
  { id: 'ALL', label: 'All Orders', countKey: 'all' },
  { id: 'PENDING', label: 'New', countKey: 'PENDING' },
  { id: 'PAID', label: 'Paid', countKey: 'PAID' },
  { id: 'PACKED', label: 'Ready to Pack', countKey: 'PACKED' },
  { id: 'SHIPPED', label: 'In Transit', countKey: 'SHIPPED' },
  { id: 'DELIVERED', label: 'Delivered', countKey: 'DELIVERED' },
  { id: 'CANCELLED', label: 'Cancelled', countKey: 'CANCELLED' },
];

export const OrderQueueStrip: React.FC<OrderQueueStripProps> = ({
  selectedStatus,
  onSelectStatus,
  counts,
}) => {
  return (
    <nav className="order-queue-strip" aria-label="Order Status Queue">
      <div className="order-queue-scroll">
        {QUEUE_ITEMS.map((item) => {
          const isSelected = selectedStatus.toUpperCase() === item.id;
          const count = counts[item.countKey] ?? 0;

          return (
            <button
              key={item.id}
              type="button"
              className={`order-queue-tab ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectStatus(item.id)}
              aria-pressed={isSelected}
            >
              <span className="queue-tab-label">{item.label}</span>
              <span className="queue-tab-count">{count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
