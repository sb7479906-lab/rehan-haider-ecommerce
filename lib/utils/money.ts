export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateOrderTotals(
  items: Array<{ price: number; quantity: number }>,
  deliveryFee = 200,
  discount = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
  return { subtotal, discount, deliveryFee, grandTotal };
}