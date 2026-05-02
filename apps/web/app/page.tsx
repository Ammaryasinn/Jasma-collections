// apps/web/app/page.tsx — Public Homepage

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jasma Collections — Luxury African Fashion",
  description:
    "Discover Jasma Collections — curated luxury African fashion. Shop our exclusive dresses, tops, and trousers imported from Turkey and China.",
};

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-300 via-charcoal-200 to-charcoal-100 opacity-90" />

      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative z-10 text-center container-jasma animate-fade-in">
        {/* Eyebrow */}
        <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-6">
          New Collection — 2024
        </p>

        {/* Main headline */}
        <h1 className="font-cormorant text-6xl md:text-8xl lg:text-9xl font-light text-cream leading-none tracking-tight mb-6">
          African
          <span className="block italic text-gold">Elegance</span>
        </h1>

        {/* Subheading */}
        <p className="font-inter text-sm md:text-base text-beige-200 max-w-md mx-auto mb-10 leading-relaxed">
          Curated luxury fashion inspired by the richness of African culture.
          Imported directly from Turkey and China — available in Nairobi.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" id="cta-shop-now" className="btn-gold">
            Shop the Collection
          </Link>
          <Link href="#story" id="cta-our-story" className="btn-secondary text-cream border-cream hover:bg-cream hover:text-charcoal">
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-gold/60">Scroll</span>
      </div>
    </section>
  );
}

// ─── Featured Categories ─────────────────────────────────────────────────────
function FeaturedCategories() {
  const categories = [
    {
      name: "Dresses",
      description: "Floor-length elegance",
      href: "/shop?category=dresses",
      accent: "Ankara & Kaftan",
    },
    {
      name: "Tops",
      description: "Modern silhouettes",
      href: "/shop?category=tops",
      accent: "Linen & Blazers",
    },
    {
      name: "Trousers",
      description: "Tailored precision",
      href: "/shop?category=trousers",
      accent: "Palazzo & Chinos",
    },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container-jasma">
        <div className="text-center mb-16">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">
            Curated Selection
          </p>
          <h2 className="section-heading">Shop by Category</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              id={`category-${cat.name.toLowerCase()}`}
              className="group block relative overflow-hidden bg-charcoal aspect-[3/4]"
            >
              {/* Placeholder gradient bg — will be replaced with real images */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-100 via-charcoal-200 to-charcoal-300 group-hover:scale-105 transition-transform duration-700" />

              {/* Gold corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-gold text-xs font-inter tracking-widest uppercase mb-1">
                  {cat.accent}
                </p>
                <h3 className="font-cormorant text-4xl text-cream font-light">{cat.name}</h3>
                <p className="text-beige-200 text-sm font-inter mt-1 mb-4">{cat.description}</p>
                <span className="text-xs font-inter tracking-widest uppercase text-gold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Story ─────────────────────────────────────────────────────────────â”€
function BrandStory() {
  return (
    <section id="story" className="py-24 bg-charcoal">
      <div className="container-jasma">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-6">
            Est. Nairobi, Kenya
          </p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-cream mb-6 leading-tight">
            Fashion That Tells{" "}
            <span className="italic text-gold">Your Story</span>
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-8" />
          <p className="font-inter text-beige-200 text-base leading-relaxed mb-6">
            Jasma Collections was born from a passion for bringing world-class fashion to Nairobi.
            We travel to Turkey and China to hand-select every piece — from flowing Ankara maxi dresses
            to precisely tailored blazers — ensuring each garment meets our standard for quality,
            craftsmanship, and timeless style.
          </p>
          <p className="font-inter text-beige-200 text-base leading-relaxed mb-10">
            Find us at our two boutiques in Gateway Mall and Roasters, or shop our growing online collection
            delivered across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-center">
            {[
              { label: "2 Boutiques", sub: "Gateway Mall & Roasters" },
              { label: "200+ Styles", sub: "New arrivals monthly" },
              { label: "5★ Rated", sub: "By our customers" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1">
                <div className="font-cormorant text-3xl text-gold">{stat.label}</div>
                <div className="font-inter text-xs tracking-widest uppercase text-beige-300 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shops / Visit Us ────────────────────────────────────────────────────────
function ShopLocations() {
  return (
    <section className="py-24 bg-cream">
      <div className="container-jasma">
        <div className="text-center mb-16">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">
            Visit Us
          </p>
          <h2 className="section-heading">Our Boutiques</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            {
              name: "Jasma — Gateway Mall",
              address: "Gateway Mall, 2nd Floor",
              city: "Mombasa Road, Nairobi",
              hours: "Mon–Sat: 9am – 7pm  |  Sun: 11am – 5pm",
            },
            {
              name: "Jasma — Roasters",
              address: "Roasters",
              city: "Nairobi",
              hours: "Mon–Sat: 9am – 7pm  |  Sun: 11am – 5pm",
            },
          ].map((shop) => (
            <div key={shop.name} className="bg-white border border-beige-200 p-8 shadow-sm hover:shadow-jasma transition-shadow duration-300">
              <div className="w-8 h-8 border-t-2 border-l-2 border-gold mb-5" />
              <h3 className="font-cormorant text-2xl text-charcoal mb-1">{shop.name}</h3>
              <p className="font-inter text-sm text-charcoal-100 mb-1">{shop.address}</p>
              <p className="font-inter text-sm text-charcoal-100 mb-4">{shop.city}</p>
              <p className="font-inter text-xs text-beige-300 tracking-wide">{shop.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/95 backdrop-blur-sm border-b border-gold/20">
      <Link href="/" className="font-cormorant text-2xl font-light text-cream tracking-widest">
        JASMA
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {[
          { label: "Shop", href: "/shop" },
          { label: "Collections", href: "/shop" },
          { label: "Our Story", href: "#story" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          id="nav-cart"
          className="font-inter text-xs tracking-widest uppercase text-beige-200 hover:text-gold transition-colors duration-200 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
        </Link>
      </div>
    </nav>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-charcoal-300 border-t border-gold/20 py-12">
      <div className="container-jasma">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="font-cormorant text-3xl text-cream tracking-widest mb-2">JASMA</div>
            <p className="font-inter text-xs text-beige-300 max-w-xs leading-relaxed">
              Luxury African fashion curated in Nairobi.
            </p>
          </div>
          <div className="flex gap-12 text-xs font-inter">
            <div>
              <div className="text-gold tracking-widest uppercase mb-3">Shop</div>
              {["Dresses", "Tops", "Trousers"].map((c) => (
                <div key={c} className="text-beige-300 mb-2 hover:text-gold cursor-pointer transition-colors">{c}</div>
              ))}
            </div>
            <div>
              <div className="text-gold tracking-widest uppercase mb-3">Info</div>
              {["Our Story", "Boutiques", "Contact", "Returns"].map((c) => (
                <div key={c} className="text-beige-300 mb-2 hover:text-gold cursor-pointer transition-colors">{c}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-inter text-xs text-beige-300">
            &copy; {new Date().getFullYear()} Jasma Collections. All rights reserved.
          </p>
          <Link href="/login" className="font-inter text-xs text-beige-300 hover:text-gold transition-colors tracking-widest uppercase">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCategories />
        <BrandStory />
        <ShopLocations />
      </main>
      <Footer />
    </>
  );
}
