/**
 * Formats a number into South African Rand currency string.
 * Example: 2399.95 -> "R2 399.95" or 1999 -> "R1 999"
 */
export const formatPrice = (price: number): string => {
  // Format with space as thousand separator
  const hasDecimals = price % 1 !== 0;
  const parts = price.toFixed(hasDecimals ? 2 : 0).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `R${parts.join('.')}`;
};
