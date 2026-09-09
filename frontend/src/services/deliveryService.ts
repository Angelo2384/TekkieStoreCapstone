import api from './api';

export interface DeliveryDetailsPayload {
  deliveryId?: string;
  customerId: string;
  fullName: string;
  phone: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  courier?: string;
  trackingNumber?: string;
  createdAt?: string;
}

export const deliveryService = {
  /**
   * Sends delivery information from checkout frontend to Spring Boot backend via Axios.
   * Endpoint: POST /api/delivery-details
   */
  saveDeliveryDetails: async (data: DeliveryDetailsPayload): Promise<DeliveryDetailsPayload> => {
    const response = await api.post<DeliveryDetailsPayload>('/api/delivery-details', data);
    return response.data;
  },

  /**
   * Retrieves the customer's latest saved delivery address via Axios.
   * If found, the checkout fields will be automatically populated.
   * Endpoint: GET /api/delivery-details/customer/{customerId}
   */
  getLatestDeliveryDetails: async (customerId: string): Promise<DeliveryDetailsPayload | null> => {
    try {
      const response = await api.get<DeliveryDetailsPayload>(
        `/api/delivery-details/customer/${encodeURIComponent(customerId)}`
      );
      return response.data && response.data.deliveryId ? response.data : null;
    } catch (error) {
      console.warn('[deliveryService] Failed to load latest delivery details:', error);
      return null;
    }
  },
};
