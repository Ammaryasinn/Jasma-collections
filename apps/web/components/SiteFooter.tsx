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
              <Image src="/logo.jpeg" alt="Jasma Collections" height={80} width={80} className="object-contain" />
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
                id="footer-instagram"
                aria-label="Jasma Collections on Instagram"
                className="w-9 h-9 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp"
                aria-label="Jasma Collections on WhatsApp"
                className="w-9 h-9 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
