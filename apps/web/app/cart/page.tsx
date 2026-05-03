"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface CartItem {
  variantId: string;
  productName: string;
  image: string | null;
  size: string;
  color: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("jasma_cart") || "[]"));
    setMounted(true);
  }, []);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("jasma_cart", JSON.stringify(updated));
  };

  const updateQuantity = (variantId: string, qty: number) => {
    if (qty <= 0) return removeItem(variantId);
    saveCart(cart.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(qty, i.maxStock) } : i)));
  };

  const removeItem = (variantId: string) => {
    saveCart(cart.filter((i) => i.variantId !== variantId));
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
        <Link href="/" className="font-cormorant text-2xl font-light text-cream tracking-widest">JASMA</Link>
        <Link href="/shop" className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors">
          Continue Shopping
        </Link>
      </nav>

      <main className="pt-20 min-h-screen bg-cream">
        <div className="container-jasma py-12">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">Review</p>
          <h1 className="font-cormorant text-5xl text-charcoal mb-2">Your Cart</h1>
          <div className="divider-gold mb-10" />

          {cart.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 text-beige-200 mb-6" />
              <h2 className="font-cormorant text-3xl text-charcoal mb-3">Your cart is empty</h2>
              <p className="font-inter text-sm text-beige-300 mb-8">Discover our curated collection of luxury African fashion.</p>
              <Link href="/shop" className="btn-primary">Shop the Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.variantId} className="bg-white border border-beige-100 p-4 flex gap-4">
                    <div className="w-24 h-32 flex-shrink-0 bg-beige-100 relative overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-cormorant text-3xl text-beige-300">{item.productName[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-cormorant text-xl text-charcoal">{item.productName}</h3>
                      <p className="font-inter text-xs text-beige-300 mt-1">{item.size} — {item.color}</p>
                      <p className="font-cormorant text-lg text-charcoal mt-2">{formatCurrency(item.price)}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 border border-beige-200">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-beige-100">-</button>
                          <span className="font-inter text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-beige-100">+</button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-cormorant text-xl text-charcoal">{formatCurrency(item.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.variantId)} className="text-beige-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-beige-100 p-6 sticky top-24">
                  <h2 className="font-cormorant text-2xl text-charcoal mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.variantId} className="flex justify-between font-inter text-sm">
                        <span className="text-charcoal-100">{item.productName} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-beige-200 pt-4 mb-6">
                    <div className="flex justify-between font-inter text-sm mb-2">
                      <span className="text-beige-300">Delivery</span>
                      <span className="text-charcoal">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between font-cormorant text-2xl text-charcoal mt-4">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" id="btn-proceed-checkout" className="btn-primary block text-center w-full">
                    Proceed to Checkout
                  </Link>
                  <p className="font-inter text-[10px] text-beige-300 text-center mt-4 tracking-wider">
                    Secure payment via M-Pesa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
