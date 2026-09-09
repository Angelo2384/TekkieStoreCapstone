import api from './api';

export interface BackendAddress {
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  postalCode: string;
}

export interface BackendDeliveryDetailsPayload {
  deliveryId: string;
  order: {
    orderId: string;
  };
  address: BackendAddress;
  courier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string; // YYYY-MM-DD
}

export interface BackendDeliveryDetailsResponse {
  deliveryId: string;
  order?: {
    orderId: string;
  };
  address: BackendAddress;
  courier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
}

export interface DeliveryDetailsPayload {
  deliveryId?: string;
  customerId?: string;
  fullName?: string;
  phone?: string;
  streetNumber?: string;
  streetName?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  courier?: string;
  trackingNumber?: string;
  createdAt?: string;
}

export const deliveryService = {
  /**
   * Saves delivery details linked to an Order in Spring Boot.
   * Endpoint: POST /deliverydetails/create
   */
  saveDeliveryDetails: async (
    data: BackendDeliveryDetailsPayload
  ): Promise<BackendDeliveryDetailsResponse> => {
    const response = await api.post<BackendDeliveryDetailsResponse>('/deliverydetails/create', data);
    return response.data;
  },

  /**
   * Retrieves DeliveryDetails by associated Order ID.
   * Endpoint: GET /deliverydetails/order/{orderId}
   */
  getDeliveryDetailsByOrderId: async (
    orderId: string
  ): Promise<BackendDeliveryDetailsResponse | null> => {
    try {
      const response = await api.get<BackendDeliveryDetailsResponse>(
        `/deliverydetails/order/${encodeURIComponent(orderId)}`
      );
      return response.data && response.data.deliveryId ? response.data : null;
    } catch (error) {
      console.warn(`[deliveryService] Failed to load delivery details for order ${orderId}:`, error);
      return null;
    }
  },

  /**
   * Legacy stub to avoid breaking existing callers
   */
  getLatestDeliveryDetails: async (_customerId: string): Promise<DeliveryDetailsPayload | null> => {
    return null;
  },
};
