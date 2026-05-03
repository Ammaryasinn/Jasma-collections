import Link from "next/link";
import Image from "next/image";

const SHOPS = [
  {
    name: "Gateway Mall",
    address: "2nd Floor, Gateway Mall",
    city: "Mombasa Road, Nairobi",
    phone: "+254 712 600 914",
    whatsapp: "254712600914",
    hours: "Mon – Sat: 9am – 7pm",
    hoursSun: "Sun: 11am – 5pm",
    mapsUrl: "https://maps.google.com/?q=Gateway+Mall+Nairobi",
  },
  {
    name: "Roasters — Thika Road",
    address: "Roasters, Marurui Road",
    city: "Along Thika Road, Nairobi",
    phone: "+254 115 005 910",
    whatsapp: "254115005910",
    hours: "Mon – Sat: 9am – 7pm",
    hoursSun: "Sun: 11am – 5pm",
    mapsUrl: "https://maps.google.com/?q=Roasters+Marurui+Road+Thika+Road+Nairobi",
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-charcoal-300 border-t border-gold/20">
      {/* Main footer grid */}
      <div className="container-jasma py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image src="/logo.png" alt="Jasma Collections" height={80} width={80} className="object-contain" />
            </Link>
            <p className="font-inter text-xs text-beige-300 leading-relaxed mb-6">
              Luxury fashion inspired by Turkish elegance,<br />curated for the modern African woman.<br />Nairobi's premier boutique.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/jasmacollection"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jasma Collections on Instagram"
                className="w-9 h-9 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100085444855018"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jasma Collections on Facebook"
                className="w-9 h-9 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links column */}
          <div>
            <div className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">Shop</div>
            <div className="space-y-3">
              {["All Styles", "Dresses", "Tops", "Trousers", "Shoes", "Accessories"].map((c) => (
                <div key={c}>
                  <Link
                    href={c === "All Styles" ? "/shop" : `/shop?category=${c}`}
                    className="font-inter text-xs text-beige-300 hover:text-gold transition-colors"
                  >
                    {c}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Boutiques column */}
          <div>
            <div className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">Our Boutiques</div>
            <div className="space-y-6">
              {SHOPS.map((shop) => (
                <div key={shop.name}>
                <p className="font-cormorant text-lg text-cream mb-1">{shop.name}</p>
                <p className="font-inter text-xs text-beige-300">{shop.address}</p>
                <p className="font-inter text-xs text-beige-300 mb-1">{shop.city}</p>
                <a href={`tel:${shop.whatsapp}`} className="font-inter text-xs text-gold hover:text-terracotta transition-colors">{shop.phone}</a>
                <p className="font-inter text-[10px] text-beige-300/70 mt-2">{shop.hours}</p>
                <p className="font-inter text-[10px] text-beige-300/70 mb-2">{shop.hoursSun}</p>
                <a
                  href={shop.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-[10px] tracking-widest uppercase text-gold hover:text-terracotta transition-colors"
                >
                  Get Directions →
                </a>
              </div>
              ))}
            </div>
          </div>

          {/* Contact / Info column */}
          <div>
            <div className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">Contact</div>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-xs text-beige-300/70 mb-1">WhatsApp</p>
                <a href="https://wa.me/254712600914" className="font-inter text-xs text-beige-300 hover:text-gold transition-colors">
                  +254 712 600 914 (Gateway Mall)
                </a>
              </div>
              <div>
                <p className="font-inter text-xs text-beige-300/70 mb-1">Peace Field Mall</p>
                <a href="https://wa.me/254115005910" className="font-inter text-xs text-beige-300 hover:text-gold transition-colors">
                  +254 115 005 910
                </a>
              </div>
              <div>
                <p className="font-inter text-xs text-beige-300/70 mb-1">Instagram</p>
                <a href="https://www.instagram.com/jasmacollection" target="_blank" rel="noopener noreferrer" className="font-inter text-xs text-beige-300 hover:text-gold transition-colors">
                  @jasmacollection
                </a>
              </div>
              <div>
                <p className="font-inter text-xs text-beige-300/70 mb-1">For orders & enquiries</p>
                <p className="font-inter text-xs text-beige-300 leading-relaxed">
                  Reach us on WhatsApp or Instagram DM — we typically respond within an hour during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10">
        <div className="container-jasma py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-inter text-[10px] text-beige-300/50">
            © {new Date().getFullYear()} Jasma Collections. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/shop" className="font-inter text-[10px] text-beige-300/50 hover:text-gold transition-colors tracking-widest uppercase">Shop</Link>
            <a href="#story" className="font-inter text-[10px] text-beige-300/50 hover:text-gold transition-colors tracking-widest uppercase">Story</a>
            <Link href="/login" className="font-inter text-[10px] text-beige-300/50 hover:text-gold transition-colors tracking-widest uppercase">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
