"use server";

import { prisma } from "@/lib/db";
import { calculateOrderTotals } from "@/lib/utils/money";

interface CreateCODOrderInput {
  userId: string;
  addressId: string;
  items: Array<{ productId: string; quantity: number }>;
  couponCode?: string;
}

export async function createCODOrder(formData: CreateCODOrderInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. COD Site Settings Verification
      const settings = await tx.siteSetting.findFirst();
      if (!settings?.codEnabled) {
        throw new Error("Cash on Delivery is currently disabled by store management.");
      }

      if (!formData.items || formData.items.length === 0) {
        throw new Error("Your cart is empty.");
      }

      // 2. Fetch fresh server-side prices & stock (Protection against front-end price tampering)
      const productIds = formData.items.map((i) => i.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds }, status: true },
      });

      if (dbProducts.length !== formData.items.length) {
        throw new Error("One or more selected products are currently unavailable.");
      }

      let subtotal = 0;
      const verifiedItems = [];

      for (const item of formData.items) {
        const product = dbProducts.find((p) => p.id === item.productId);
        if (!product) throw new Error("Product not found.");

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available stock: ${product.stock}`
          );
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        verifiedItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 3. Verify COD minimum and maximum order limits
      if (subtotal < settings.minCodOrder || subtotal > settings.maxCodOrder) {
        throw new Error(
          `COD order total must be between Rs. ${settings.minCodOrder.toLocaleString()} and Rs. ${settings.maxCodOrder.toLocaleString()}.`
        );
      }

      // 4. Delivery Charges Calculation
      const deliveryFee = subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
      const totals = calculateOrderTotals(verifiedItems, deliveryFee, 0);

      // 5. Deduct stock transactionally
      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 6. Create COD Order Record
      const order = await tx.order.create({
        data: {
          userId: formData.userId,
          addressId: formData.addressId,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          grandTotal: totals.grandTotal,
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          couponCode: formData.couponCode || null,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "Order placed via Cash on Delivery.",
            },
          },
        },
      });

      return { success: true, orderId: order.id };
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to place COD Order. Please try again.",
    };
  }
}