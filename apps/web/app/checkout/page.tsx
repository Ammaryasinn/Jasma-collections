"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Phone, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  customerPhone: z.string().min(9, "Please enter a valid Safaricom number"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  shippingAddress: z.string().min(10, "Please provide a more detailed address"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stkSent, setStkSent] = useState(false);
  const [orderId, setOrderId] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jasma_cart") || "[]");
    setCart(stored);
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const onSubmit = async (formData: FormData) => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mpesa/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate payment");

      setOrderId(data.data.orderId);
      setStkSent(true);

      // Clear cart
      localStorage.removeItem("jasma_cart");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  // STK Push sent — wait for payment
  if (stkSent) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
          <Link href="/" className="flex items-center">
          <Image src="/logo.jpeg" alt="Jasma Collections" height={44} width={44} className="object-contain" />
        </Link>
        </nav>
        <main className="pt-20 min-h-screen bg-cream flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-6">
            <div className="w-20 h-20 border-2 border-gold mx-auto flex items-center justify-center mb-8">
              <Phone className="w-10 h-10 text-gold" />
            </div>
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Payment Pending</p>
            <h1 className="font-cormorant text-4xl text-charcoal mb-4">Check Your Phone</h1>
            <div className="w-12 h-px bg-gold mx-auto mb-6" />
            <p className="font-inter text-sm text-charcoal-100 leading-relaxed mb-4">
              An M-Pesa STK push has been sent to your number. Please enter your PIN to complete the payment of{" "}
              <strong>{formatCurrency(total)}</strong>.
            </p>
            <p className="font-inter text-xs text-beige-300 mb-8">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
            <div className="flex justify-center mb-8">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
            <p className="font-inter text-xs text-beige-300">
              Your order will be confirmed automatically once payment is received.
              If you have any issues, contact us on WhatsApp.
            </p>
            <Link href="/" className="btn-ghost mt-8 inline-block text-terracotta text-xs tracking-widest uppercase">
              Back to Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
        <Link href="/" className="flex items-center">
          <Image src="/logo.jpeg" alt="Jasma Collections" height={44} width={44} className="object-contain" />
        </Link>
        <Link href="/cart" className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors">
          Back to Cart
        </Link>
      </nav>

      <main className="pt-20 min-h-screen bg-cream">
        <div className="container-jasma py-12">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">Secure Checkout</p>
          <h1 className="font-cormorant text-5xl text-charcoal mb-2">Complete Your Order</h1>
          <div className="divider-gold mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-inter">{error}</div>
              )}

              <div className="bg-white border border-beige-100 p-6">
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Your Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-inter text-xs tracking-widest uppercase text-charcoal-100 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-300" />
                      <input {...register("customerName")} placeholder="Jane Wanjiku" className={`input-field pl-10 ${errors.customerName ? "border-red-400" : ""}`} />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                  </div>

                  <div>
                    <label className="block font-inter text-xs tracking-widest uppercase text-charcoal-100 mb-2">Safaricom Number (M-Pesa) *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-300" />
                      <input {...register("customerPhone")} placeholder="0712 345 678" className={`input-field pl-10 ${errors.customerPhone ? "border-red-400" : ""}`} />
                    </div>
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
                    <p className="text-beige-300 text-xs mt-1">An M-Pesa PIN prompt will be sent to this number.</p>
                  </div>

                  <div>
                    <label className="block font-inter text-xs tracking-widest uppercase text-charcoal-100 mb-2">Email Address (Optional)</label>
                    <input {...register("customerEmail")} type="email" placeholder="jane@example.com" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-beige-100 p-6">
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Delivery Address</h2>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-beige-300" />
                  <textarea
                    {...register("shippingAddress")}
                    rows={4}
                    placeholder="e.g. Westlands, Nairobi. Near ABC Place, House 12"
                    className={`input-field pl-10 resize-none ${errors.shippingAddress ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>}
              </div>

              <button
                type="submit"
                id="btn-place-order"
                disabled={isSubmitting || cart.length === 0}
                className="btn-gold w-full flex items-center justify-center gap-3 py-4"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                ) : (
                  <>Pay {formatCurrency(total)} via M-Pesa</>
                )}
              </button>
              <p className="text-center font-inter text-xs text-beige-300">
                By placing this order you agree to our terms and conditions.
              </p>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-beige-100 p-6 sticky top-24">
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Your Order</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex justify-between font-inter text-sm">
                      <div>
                        <div className="font-medium text-charcoal">{item.productName}</div>
                        <div className="text-beige-300 text-xs">{item.size} — {item.color} ×{item.quantity}</div>
                      </div>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-beige-200 pt-4">
                  <div className="flex justify-between font-cormorant text-2xl text-charcoal">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
