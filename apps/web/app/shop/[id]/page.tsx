// apps/web/app/shop/[id]/page.tsx — Product Detail Page
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found — Jasma Collections" };
  return {
    title: `${product.name} — Jasma Collections`,
    description: product.description || `Shop ${product.name} at Jasma Collections.`,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  // Get unique sizes and colors from variants
  const sizes = Array.from(new Set<string>(product.variants.map((v: any) => v.size)));
  const colors = Array.from(new Set<string>(product.variants.map((v: any) => v.color)));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
        <Link href="/" className="font-cormorant text-2xl font-light text-cream tracking-widest">JASMA</Link>
        <Link href="/cart" className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
        </Link>
      </nav>

      <main className="pt-20 min-h-screen bg-cream">
        {/* Breadcrumb */}
        <div className="container-jasma py-4">
          <div className="flex items-center gap-2 font-inter text-xs text-beige-300 tracking-widest uppercase">
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-charcoal">{product.category.name}</span>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>

        <div className="container-jasma pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left — Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] relative bg-beige-100 overflow-hidden">
                {product.images && product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-beige-100 to-beige-200 flex items-center justify-center">
                    <span className="font-cormorant text-9xl text-beige-300 font-light">{product.name[0]}</span>
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img: string, i: number) => (
                    <div key={i} className="aspect-square relative overflow-hidden bg-beige-100">
                      <Image src={img} alt={`${product.name} view ${i + 2}`} fill className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info */}
            <div className="lg:pt-8">
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-3">
                {product.category.name} · {product.gender.charAt(0) + product.gender.slice(1).toLowerCase()}
              </p>
              <h1 className="font-cormorant text-5xl text-charcoal mb-2 leading-tight">{product.name}</h1>
              <div className="w-12 h-px bg-gold mb-6" />

              {product.description && (
                <p className="font-inter text-sm text-charcoal-100 leading-relaxed mb-8">{product.description}</p>
              )}

              {/* Client-side Add to Cart — receives server-fetched variants */}
              <AddToCartButton product={product} variants={product.variants} />

              {/* Meta info */}
              <div className="mt-10 pt-6 border-t border-beige-200 space-y-4">
                <div className="flex gap-3">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12L18 8" /></svg>
                  </div>
                  <div>
                    <p className="font-inter text-xs font-semibold tracking-widest uppercase text-charcoal">Delivery</p>
                    <p className="font-inter text-xs text-beige-300 mt-0.5">Nairobi delivery within 2–3 business days via G4S</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="font-inter text-xs font-semibold tracking-widest uppercase text-charcoal">Secure Payment</p>
                    <p className="font-inter text-xs text-beige-300 mt-0.5">Payments secured by Safaricom M-Pesa</p>
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
