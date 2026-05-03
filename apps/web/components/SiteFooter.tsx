import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";

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
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100085444855018"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jasma Collections on Facebook"
                className="w-9 h-9 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
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
