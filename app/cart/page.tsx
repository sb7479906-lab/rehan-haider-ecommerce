"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-neutral-500 text-sm">
          Looks like you haven't added any products to your cart yet.
        </p>
        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900">Shopping Cart ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 border rounded-lg bg-white divide-y">
          {cart.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-neutral-100 rounded flex items-center justify-center text-xs text-neutral-400 font-semibold">
                  ITEM
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base">{item.name}</h3>
                  <p className="text-emerald-600 font-semibold text-sm">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="border rounded-lg bg-white p-6 space-y-4 h-fit">
          <h2 className="font-bold text-lg text-neutral-900 border-b pb-3">Order Summary</h2>

          <div className="space-y-2 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 font-medium">Calculated at Checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-medium text-neutral-900">Cash on Delivery</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-base text-neutral-900">
            <span>Estimated Total</span>
            <span className="text-emerald-600">Rs. {cartTotal.toLocaleString()}</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-md transition text-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}