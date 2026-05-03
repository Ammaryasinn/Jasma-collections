import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Shop — Jasma Collections",
  description: "Explore our curated selection of luxury African fashion and footwear.",
};

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.categories || [];
  } catch {
    return [];
  }
}

async function getProducts(category?: string, gender?: string) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (gender) params.set("gender", gender);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/products?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.products || [];
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; gender?: string };
}) {
  const activeCategory = searchParams.category || "All";

  // Fetch both in parallel
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchParams.category, searchParams.gender),
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  const getFromPrice = (product: any) => {
    if (!product.variants || product.variants.length === 0) return null;
    return Math.min(...product.variants.map((v: any) => Number(v.price)));
  };

  const hasStock = (product: any) => {
    return product.variants?.some((v: any) =>
      v.inventory?.some((i: any) => i.quantity > 0)
    );
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
        <Link href="/" className="font-cormorant text-2xl font-light text-cream tracking-widest">JASMA</Link>
        <div className="hidden md:flex items-center gap-8">
          {categories.slice(0, 5).map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.name}`}
              className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <Link href="/cart" id="nav-cart" className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
        </Link>
      </nav>

      <main className="pt-24 min-h-screen bg-cream">
        <div className="container-jasma py-10">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">The Collection</p>
          <h1 className="font-cormorant text-5xl text-charcoal mb-2">
            {activeCategory === "All" ? "Shop All Styles" : activeCategory}
          </h1>
          <div className="divider-gold mb-8" />

          {/* Dynamic Category Filters */}
          <div className="flex gap-2 flex-wrap mb-10">
            <Link
              href="/shop"
              className={`px-5 py-2 font-inter text-xs tracking-widest uppercase border transition-all duration-200 ${
                activeCategory === "All"
                  ? "bg-charcoal text-cream border-charcoal"
                  : "text-charcoal border-beige-200 hover:border-charcoal"
              }`}
            >
              All
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.name}`}
                className={`px-5 py-2 font-inter text-xs tracking-widest uppercase border transition-all duration-200 ${
                  activeCategory === cat.name
                    ? "bg-charcoal text-cream border-charcoal"
                    : "text-charcoal border-beige-200 hover:border-charcoal"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-cormorant text-3xl text-charcoal mb-2">No products found</p>
              <p className="font-inter text-sm text-beige-300">Try a different category or check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => {
                const fromPrice = getFromPrice(product);
                const inStock = hasStock(product);

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.id}`}
                    id={`product-${product.id}`}
                    className="group block bg-white border border-beige-100 hover:border-beige-200 hover:shadow-jazma transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="aspect-[3/4] bg-cream relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-beige-100 to-beige-200 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                          <span className="font-cormorant text-6xl text-beige-300 font-light">{product.name[0]}</span>
                        </div>
                      )}
                      {!inStock && (
                        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                          <span className="font-inter text-xs tracking-widest uppercase text-cream bg-charcoal px-3 py-1">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="font-inter text-[10px] tracking-widest uppercase bg-cream/90 text-charcoal px-2 py-1">
                          {product.category.name}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-cormorant text-xl text-charcoal group-hover:text-terracotta transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="font-inter text-xs text-beige-300 tracking-widest uppercase mt-1 mb-3">
                        {product.gender.charAt(0) + product.gender.slice(1).toLowerCase()}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="font-cormorant text-lg text-charcoal">
                          {fromPrice ? `From ${formatCurrency(fromPrice)}` : "—"}
                        </div>
                        <div className="w-6 h-6 border border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-cream transition-all duration-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
