import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { icon: "▦", label: "Overview", href: "/admin" },
    { icon: "◈", label: "Products", href: "/admin/products" },
    { icon: "⊞", label: "Inventory", href: "/admin/inventory" },
    { icon: "⊡", label: "Orders", href: "/admin/orders" },
    { icon: "⊟", label: "Sales", href: "/admin/sales" },
    { icon: "◉", label: "Reports", href: "/admin/reports" },
    { icon: "◎", label: "Staff", href: "/admin/staff" },
    { icon: "◌", label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-charcoal-300 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gold/20">
          <Link href="/admin" className="block w-16 mb-2">
            <Image src="/logo.png" alt="Jasma" width={64} height={64} className="object-contain" />
          </Link>
          <div className="text-gold text-[10px] font-inter tracking-[0.3em] uppercase mt-0.5">Admin Panel</div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-terracotta flex items-center justify-center text-white text-sm font-cormorant font-semibold">
              {session.user?.name?.[0] ?? "A"}
            </div>
            <div>
              <div className="text-cream text-sm font-inter font-medium truncate max-w-[130px]">
                {session.user?.name ?? "Admin"}
              </div>
              <div className="text-beige-300 text-xs font-inter">
                {session.user?.role ?? "SUPER_ADMIN"}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-item text-beige-300 hover:text-white hover:bg-white/5 flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <a
            href="/api/auth/signout"
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
          >
            <span>⎋</span>
            Sign out
          </a>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
