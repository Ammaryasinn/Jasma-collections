// apps/web/app/page.tsx — Public Homepage
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Jasma Collections — Luxury Fashion in Nairobi",
  description:
    "Discover Jasma Collections — curated luxury fashion for women and men. Dresses, tops, trousers, shoes and more. Imported from Turkey. Shop in Gateway Mall, Roasters, or online.",
};

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
          { label: "Our Story", href: "#story" },
          { label: "Find Us", href: "#locations" },
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
        <a
          href="https://www.instagram.com/jasmacollection"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-beige-200 hover:text-gold transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-300 via-charcoal-200 to-charcoal-100 opacity-90" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative z-10 text-center container-jasma animate-fade-in">
        <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-6">
          New Collection — 2025
        </p>
        <h1 className="font-cormorant text-6xl md:text-8xl lg:text-9xl font-light text-cream leading-none tracking-tight mb-6">
          African
          <span className="block italic text-gold">Elegance</span>
        </h1>
        <p className="font-inter text-sm md:text-base text-beige-200 max-w-md mx-auto mb-10 leading-relaxed">
          Curated luxury fashion for women — from flowing dresses and tailored tops
          to statement shoes. Imported directly from Turkey, available in Nairobi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" id="cta-shop-now" className="btn-gold">
            Shop the Collection
          </Link>
          <Link href="#story" id="cta-our-story" className="btn-secondary text-cream border-cream hover:bg-cream hover:text-charcoal">
            Our Story
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-gold/60">Scroll</span>
      </div>
    </section>
  );
}

// ─── Featured Categories ──────────────────────────────────────────────────────
function FeaturedCategories() {
  const categories = [
    { name: "Dresses", description: "Floor-length elegance & midi cuts", href: "/shop?category=Dresses", accent: "Maxi & Midi" },
    { name: "Tops & Sets", description: "Modern silhouettes & co-ords", href: "/shop?category=Tops", accent: "Linen & Blazers" },
    { name: "Trousers", description: "Tailored precision", href: "/shop?category=Trousers", accent: "Palazzo & Chinos" },
    { name: "Shoes", description: "From sandals to heels", href: "/shop?category=Shoes", accent: "Flats & Heels" },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container-jasma">
        <div className="text-center mb-16">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">Curated Selection</p>
          <h2 className="section-heading">Shop by Category</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              id={`category-${cat.name.toLowerCase().replace(/\s/g, "-")}`}
              className="group block relative overflow-hidden bg-charcoal aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-100 via-charcoal-200 to-charcoal-300 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-gold text-[10px] font-inter tracking-widest uppercase mb-1">{cat.accent}</p>
                <h3 className="font-cormorant text-3xl text-cream font-light">{cat.name}</h3>
                <p className="text-beige-200 text-xs font-inter mt-1 mb-4">{cat.description}</p>
                <span className="text-xs font-inter tracking-widest uppercase text-gold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Explore
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop" className="btn-secondary">View Full Collection</Link>
        </div>
      </div>
    </section>
  );
}

// ─── Brand Story ──────────────────────────────────────────────────────────────
function BrandStory() {
  return (
    <section id="story" className="py-24 bg-charcoal">
      <div className="container-jasma">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-6">Est. Nairobi, Kenya</p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-cream mb-6 leading-tight">
            Fashion That Tells{" "}
            <span className="italic text-gold">Your Story</span>
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-8" />
          <p className="font-inter text-beige-200 text-base leading-relaxed mb-6">
            Jasma Collections was born from a passion for bringing world-class fashion to Nairobi.
            We travel to Turkey to hand-select every piece — from flowing maxi dresses and embellished abayas
            to precisely tailored blazers, palazzo trousers, and statement shoes — ensuring each item
            meets our standard for quality, craftsmanship, and timeless style.
          </p>
          <p className="font-inter text-beige-200 text-base leading-relaxed mb-10">
            Our collection is broad by design. We believe every woman deserves a complete wardrobe —
            from the office to the event to the everyday. Find us at our two boutiques — Gateway Mall on Mombasa Road, and Roasters along Thika Road — or shop our growing online collection
            delivered across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-center">
            {[
              { label: "2 Boutiques", sub: "Gateway Mall & Roasters" },
              { label: "300+ Styles", sub: "New arrivals weekly" },
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

// ─── Shop Locations ───────────────────────────────────────────────────────────
function ShopLocations() {
  return (
    <section id="locations" className="py-24 bg-cream">
      <div className="container-jasma">
        <div className="text-center mb-16">
          <p className="text-xs font-inter tracking-[0.4em] uppercase text-gold mb-3">Visit Us</p>
          <h2 className="section-heading">Our Boutiques</h2>
          <div className="divider-gold" />
          <p className="font-inter text-sm text-charcoal-100 mt-4 max-w-md mx-auto">
            Come experience the full collection in person. Our team is always on hand to help you find the perfect piece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            {
              name: "Gateway Mall",
              address: "2nd Floor, Gateway Mall",
              city: "Mombasa Road, Nairobi",
              phone: "+254 712 600 914",
              whatsapp: "254712600914",
              hours: "Mon – Sat: 9:00am – 7:00pm",
              hoursSun: "Sunday: 11:00am – 5:00pm",
              mapsUrl: "https://maps.google.com/?q=Gateway+Mall+Nairobi",
            },
            {
              name: "Roasters — Thika Road",
              address: "Roasters, Marurui Road",
              city: "Along Thika Road, Nairobi",
              phone: "+254 115 005 910",
              whatsapp: "254115005910",
              hours: "Mon – Sat: 9:00am – 7:00pm",
              hoursSun: "Sunday: 11:00am – 5:00pm",
              mapsUrl: "https://maps.google.com/?q=Roasters+Marurui+Road+Thika+Road+Nairobi",
            },
          ].map((shop) => (
            <div key={shop.name} className="bg-white border border-beige-200 p-8 shadow-sm hover:shadow-jasma transition-shadow duration-300">
              <div className="w-8 h-8 border-t-2 border-l-2 border-gold mb-5" />
              <h3 className="font-cormorant text-2xl text-charcoal mb-1">Jasma — {shop.name}</h3>
              <p className="font-inter text-sm text-charcoal-100">{shop.address}</p>
              <p className="font-inter text-sm text-charcoal-100 mb-2">{shop.city}</p>
              <a href={`tel:${shop.whatsapp}`} className="font-inter text-sm text-gold hover:text-terracotta transition-colors block mb-3">{shop.phone}</a>
              <div className="w-8 h-px bg-beige-200 mb-4" />
              <p className="font-inter text-xs text-beige-300">{shop.hours}</p>
              <p className="font-inter text-xs text-beige-300 mb-5">{shop.hoursSun}</p>
              <a
                href={shop.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-xs tracking-widest uppercase text-gold hover:text-terracotta transition-colors flex items-center gap-2"
              >
                Get Directions
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Instagram Strip ──────────────────────────────────────────────────────────
function InstagramStrip() {
  return (
    <section className="py-20 bg-charcoal">
      <div className="container-jasma text-center">
        <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Follow the Journey</p>
        <h2 className="font-cormorant text-5xl text-cream mb-4">
          <span className="italic">@jasmacollection</span>
        </h2>
        <div className="w-12 h-px bg-gold mx-auto mb-6" />
        <p className="font-inter text-sm text-beige-300 max-w-sm mx-auto mb-8 leading-relaxed">
          New arrivals, styling inspiration, and behind-the-scenes — all on Instagram. Tag us in your looks.
        </p>
        <a
          href="https://www.instagram.com/jasmacollection"
          target="_blank"
          rel="noopener noreferrer"
          id="cta-instagram"
          className="inline-flex items-center gap-3 border border-gold text-gold hover:bg-gold hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-widest uppercase px-8 py-3"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow @jasmacollection
        </a>
      </div>
    </section>
  );
}

// ─── WhatsApp CTA Banner ──────────────────────────────────────────────────────
function WhatsAppBanner() {
  return (
    <section className="py-14 bg-[#075E54]">
      <div className="container-jasma flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-cormorant text-3xl text-white mb-1">Need help choosing?</h3>
          <p className="font-inter text-sm text-white/70">Chat with our stylists on WhatsApp — we are always happy to help.</p>
        </div>
        <a
          href="https://wa.me/254712600914?text=Hi%20Jasma!%20I%20need%20help%20finding%20an%20outfit."
          target="_blank"
          rel="noopener noreferrer"
          id="cta-whatsapp-banner"
          className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-[#075E54] hover:bg-[#25D366] hover:text-white transition-all duration-300 font-inter text-xs tracking-widest uppercase px-7 py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCategories />
        <BrandStory />
        <WhatsAppBanner />
        <ShopLocations />
        <InstagramStrip />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
