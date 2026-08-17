import Link from "next/link";
import { Truck, ShieldCheck, Clock, Phone, ArrowRight } from "lucide-react";

export default async function HomePage() {
  // Sample Featured Products
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Leather Wallet",
      price: 2499,
      originalPrice: 3500,
      category: "Fashion",
    },
    {
      id: "2",
      name: "Wireless Noise-Canceling Earbuds",
      price: 6999,
      originalPrice: 9999,
      category: "Electronics",
    },
    {
      id: "3",
      name: "Classic Chronograph Watch",
      price: 12500,
      originalPrice: 16000,
      category: "Accessories",
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="bg-neutral-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <span className="bg-emerald-600/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Cash on Delivery Available Across Pakistan
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Premium Shopping, Delivered To Your Doorstep
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
            Explore quality products with fast nationwide shipping and 100% Cash on Delivery payment protection.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-md transition flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-neutral-700 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-md transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> WhatsApp Order
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="p-5 border rounded-lg bg-white shadow-sm flex flex-col items-center space-y-2">
          <Truck className="w-8 h-8 text-emerald-600" />
          <h3 className="font-semibold text-sm">Nationwide Delivery</h3>
          <p className="text-xs text-neutral-500">Fast shipping across all cities</p>
        </div>
        <div className="p-5 border rounded-lg bg-white shadow-sm flex flex-col items-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="font-semibold text-sm">100% Cash on Delivery</h3>
          <p className="text-xs text-neutral-500">Pay cash upon parcel arrival</p>
        </div>
        <div className="p-5 border rounded-lg bg-white shadow-sm flex flex-col items-center space-y-2">
          <Clock className="w-8 h-8 text-emerald-600" />
          <h3 className="font-semibold text-sm">24-48 Hours Dispatch</h3>
          <p className="text-xs text-neutral-500">Quick processing time</p>
        </div>
        <div className="p-5 border rounded-lg bg-white shadow-sm flex flex-col items-center space-y-2">
          <Phone className="w-8 h-8 text-emerald-600" />
          <h3 className="font-semibold text-sm">Dedicated Support</h3>
          <p className="text-xs text-neutral-500">Instant WhatsApp assistance</p>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Featured Products</h2>
            <p className="text-sm text-neutral-500">Handpicked items with active discounts</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-12 bg-neutral-100 text-center relative flex items-center justify-center">
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  SALE
                </span>
                <span className="text-neutral-400 font-medium text-sm">Product Image Placeholder</span>
              </div>
              <div className="p-4 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-semibold">{product.category}</span>
                <h3 className="font-bold text-neutral-900">{product.name}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-bold text-emerald-600">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-xs text-neutral-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4 border-t bg-neutral-50">
                <button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2 rounded text-sm font-medium transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
