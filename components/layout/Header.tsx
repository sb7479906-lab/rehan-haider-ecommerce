"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, PhoneCall } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      {/* Top Banner - COD & Support Announcement */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 flex justify-between items-center">
        <span>🚚 Cash on Delivery (COD) Available Across Pakistan</span>
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-emerald-400 transition"
          >
            <PhoneCall className="w-3 h-3" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-900">
          REHAN HAIDER<span className="text-emerald-600">.</span>
        </Link>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md relative items-center"
        >
          <input
            type="text"
            placeholder="Search products, categories, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="absolute right-3 text-neutral-500 hover:text-neutral-900"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Header Actions */}
        <div className="flex items-center space-x-5">
          <Link
            href="/account"
            className="text-neutral-700 hover:text-emerald-600 transition flex items-center space-x-1"
          >
            <User className="w-5 h-5" />
            <span className="hidden lg:inline text-sm font-medium">Account</span>
          </Link>

          <Link
            href="/wishlist"
            className="text-neutral-700 hover:text-emerald-600 transition relative"
          >
            <Heart className="w-5 h-5" />
          </Link>

          <Link
            href="/cart"
            className="text-neutral-700 hover:text-emerald-600 transition relative flex items-center space-x-1"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden lg:inline text-sm font-medium">Cart</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-700 hover:text-neutral-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Links (Desktop) */}
      <nav className="hidden md:block bg-neutral-50 border-t py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 text-sm font-medium text-neutral-700">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link href="/shop" className="hover:text-emerald-600 transition">
            Shop All
          </Link>
          <Link href="/categories/electronics" className="hover:text-emerald-600 transition">
            Electronics
          </Link>
          <Link href="/categories/fashion" className="hover:text-emerald-600 transition">
            Fashion
          </Link>
          <Link href="/categories/new-arrivals" className="hover:text-emerald-600 transition">
            New Arrivals
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative my-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-md text-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-neutral-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-3 font-medium text-sm text-neutral-800">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
              Shop All
            </Link>
            <Link href="/categories/electronics" onClick={() => setIsMobileMenuOpen(false)}>
              Electronics
            </Link>
            <Link href="/categories/fashion" onClick={() => setIsMobileMenuOpen(false)}>
              Fashion
            </Link>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
              My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
