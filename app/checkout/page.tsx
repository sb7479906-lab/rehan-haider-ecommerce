"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createCODOrder } from "@/app/actions/order";
import { CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "Punjab",
    postalCode: "",
    notes: "",
  });

  const deliveryFee = cartTotal >= 5000 ? 0 : 200;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Call Server Action
      const res = await createCODOrder({
        userId: "guest-user", // Temporary placeholder for guest checkout
        addressId: "temp-address-id",
        items,
      });

      if (res.success && res.orderId) {
        clearCart();
        setOrderSuccess({ id: res.orderId });
      } else {
        setError(res.error || "Failed to place order.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900">Order Placed Successfully!</h1>
        <p className="text-neutral-600">
          Thank you for shopping with <span className="font-semibold text-neutral-900">Rehan Haider</span>.
        </p>

        <div className="bg-neutral-50 border rounded-lg p-6 max-w-md mx-auto text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Order ID:</span>
            <span className="font-mono font-bold text-neutral-900">{orderSuccess.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Payment Method:</span>
            <span className="font-semibold text-emerald-600">Cash on Delivery (COD)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Payment Status:</span>
            <span className="font-medium text-amber-600">Cash Pending</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2 font-bold">
            <span>Total Payable:</span>
            <span className="text-emerald-600">Rs. {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/shop"
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-md text-sm font-medium transition"
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-2.5 rounded-md text-sm font-medium transition"
          >
            Track via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">No Items to Checkout</h2>
        <p className="text-neutral-500 text-sm">Please add products to your cart first.</p>
        <Link
          href="/shop"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-emerald-500"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Checkout & Shipping</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2 border rounded-lg bg-white p-6 space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-3">Shipping Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Muhammad Ali"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number (COD Verification) *</label>
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="ali@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="Lahore / Karachi / Islamabad"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Complete Address *</label>
            <textarea
              required
              rows={3}
              placeholder="House/Apartment #, Street, Block, Area..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Payment Method Badge */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-sm font-bold text-neutral-900">Payment Method</h3>
            <div className="p-4 border-2 border-emerald-600 bg-emerald-50/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-bold text-sm text-neutral-900">Cash on Delivery (COD)</p>
                  <p className="text-xs text-neutral-500">Pay cash upon parcel delivery at your doorstep.</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Confirm Button */}
        <div className="border rounded-lg bg-white p-6 space-y-4 h-fit">
          <h2 className="font-bold text-lg text-neutral-900 border-b pb-3">Order Summary</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-xs border-b pb-2">
                <div>
                  <p className="font-semibold text-neutral-900">{item.name}</p>
                  <p className="text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-neutral-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm text-neutral-600 border-t pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-neutral-900">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${deliveryFee}`}
              </span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg text-neutral-900">
            <span>Total Amount</span>
            <span className="text-emerald-600">Rs. {grandTotal.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-400 text-white font-bold py-3.5 rounded-md transition text-sm flex items-center justify-center space-x-2"
          >
            {loading ? "Processing Order..." : "Place COD Order"}
          </button>
        </div>
      </form>
    </div>
  );
}