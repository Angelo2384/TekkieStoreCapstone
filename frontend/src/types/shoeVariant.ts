/**
 * ShoeVariant & ShoeSize Types
 * Represents the Spring Boot ShoeVariant entity and its @Embeddable ShoeSize value object.
 */

// Embeddable value object inside ShoeVariant (NOT a standalone entity)
export interface ShoeSize {
  sizeValue: number;
  sizeRegion: string;
}

// Lightweight reference to the parent Shoe entity
export interface ShoeVariantShoeRef {
  shoeId: string;
  brand?: string;
  shoeName?: string;
  category?: string;
  [key: string]: any;
}

// Main ShoeVariant entity interface matching Spring Boot ShoeVariant domain model
export interface ShoeVariant {
  variantId: string;
  shoe?: ShoeVariantShoeRef | null;
  size: ShoeSize;
  colour: string;
  stockQuantity: number;
}
