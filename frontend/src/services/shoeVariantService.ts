import api from './api';
import { ShoeVariant } from '../types/shoeVariant';

export * from '../types/shoeVariant';

/**
 * Service to interact with the Spring Boot ShoeVariant REST API.
 * ShoeSize is an @Embeddable value object inside ShoeVariant —
 * it is transmitted as nested JSON and has no standalone endpoints.
 */
export const shoeVariantService = {
  /**
   * Fetch all shoe variants.
   * Endpoint: GET /shoeVariant/getAll
   */
  getAllVariants: async (): Promise<ShoeVariant[]> => {
    const response = await api.get<ShoeVariant[]>('/shoeVariant/getAll');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Fetch all variants belonging to a specific shoe.
   * Endpoint: GET /shoeVariant/shoe/{shoeId}
   *
   * Errors are NOT caught here — they propagate so ProductDetails can
   * distinguish: API error | no variants | variants loaded.
   */
  getVariantsByShoeId: async (shoeId: string): Promise<ShoeVariant[]> => {
    const response = await api.get<ShoeVariant[]>(
      `/shoeVariant/shoe/${encodeURIComponent(shoeId)}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Fetch a single variant by its ID.
   * Endpoint: GET /shoeVariant/read/{id}
   */
  getVariantById: async (id: string): Promise<ShoeVariant | null> => {
    try {
      const response = await api.get<ShoeVariant>(`/shoeVariant/read/${encodeURIComponent(id)}`);
      return response.data || null;
    } catch (error) {
      console.warn(`[shoeVariantService] Failed to fetch variant ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new shoe variant.
   * Endpoint: POST /shoeVariant/create
   */
  createVariant: async (variant: ShoeVariant): Promise<ShoeVariant | null> => {
    try {
      const response = await api.post<ShoeVariant>('/shoeVariant/create', variant);
      return response.data || null;
    } catch (error) {
      console.error('[shoeVariantService] Failed to create variant:', error);
      return null;
    }
  },

  /**
   * Update an existing shoe variant.
   * Endpoint: POST /shoeVariant/update
   */
  updateVariant: async (variant: ShoeVariant): Promise<ShoeVariant | null> => {
    try {
      const response = await api.post<ShoeVariant>('/shoeVariant/update', variant);
      return response.data || null;
    } catch (error) {
      console.error('[shoeVariantService] Failed to update variant:', error);
      return null;
    }
  },

  /**
   * Delete a shoe variant by its ID.
   * Endpoint: DELETE /shoeVariant/delete/{id}
   */
  deleteVariant: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete<boolean>(`/shoeVariant/delete/${encodeURIComponent(id)}`);
      return response.data === true;
    } catch (error) {
      console.error(`[shoeVariantService] Failed to delete variant ${id}:`, error);
      return false;
    }
  },
};

// Convenience named exports
export const fetchAllVariants = shoeVariantService.getAllVariants;
export const fetchVariantById = shoeVariantService.getVariantById;
export const fetchVariantsByShoeId = shoeVariantService.getVariantsByShoeId;
export const createVariant = shoeVariantService.createVariant;
export const updateVariant = shoeVariantService.updateVariant;
export const deleteVariant = shoeVariantService.deleteVariant;

export default shoeVariantService;
