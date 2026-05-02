// apps/web/app/admin/page.tsx — Admin Dashboard Shell

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DollarSign, TrendingUp, AlertTriangle, Package, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Fetch KPI Data
  let kpis = {
    todaysRevenue: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    pendingOrders: 0
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/dashboard`, {
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      cache: "no-store"
    });
    const data = await res.json();
    if (data.success) {
      kpis = data.data.kpis;
    }
  } catch (err) {
    console.error("Failed to fetch KPIs:", err);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
  };

  const cards = [
    { label: "Today's Sales", value: formatCurrency(kpis.todaysRevenue), icon: <DollarSign className="w-6 h-6" />, color: "bg-terracotta-50 text-terracotta-300" },
    { label: "Total Revenue", value: formatCurrency(kpis.totalRevenue), icon: <TrendingUp className="w-6 h-6" />, color: "bg-gold-50 text-gold-400" },
    { label: "Low Stock Alerts", value: kpis.lowStockCount.toString(), icon: <AlertTriangle className="w-6 h-6" />, color: "bg-red-50 text-red-600" },
    { label: "Pending Orders", value: kpis.pendingOrders.toString(), icon: <Package className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
  ];

  const navItems = [
    { icon: "▦", label: "Overview", href: "/admin", active: true },
    { icon: "◈", label: "Products", href: "/admin/products", active: false },
    { icon: "⊞", label: "Inventory", href: "/admin/inventory", active: false },
    { icon: "⊡", label: "Orders", href: "/admin/orders", active: false },
    { icon: "⊟", label: "Sales", href: "/admin/sales", active: false },
    { icon: "◉", label: "Reports", href: "/admin/reports", active: false },
    { icon: "◎", label: "Staff", href: "/admin/staff", active: false },
    { icon: "◌", label: "Settings", href: "/admin/settings", active: false },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-charcoal-300 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gold/20">
          <div className="font-cormorant text-2xl text-cream tracking-widest">JASMA</div>
          <div className="text-gold text-[10px] font-inter tracking-[0.3em] uppercase mt-0.5">Admin Panel</div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-terracotta flex items-center justify-center text-white text-sm font-cormorant font-semibold">
              {session?.user?.name?.[0] ?? "A"}
            </div>
            <div>
              <div className="text-cream text-sm font-inter font-medium truncate max-w-[130px]">
                {session?.user?.name ?? "Admin"}
              </div>
              <div className="text-beige-300 text-xs font-inter">
                {session?.user?.role ?? "SUPER_ADMIN"}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              className={item.active ? "nav-item-active" : "nav-item"}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <a
            href="/api/auth/signout"
            id="admin-signout"
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <span>⎋</span>
            Sign out
          </a>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-inter tracking-widest uppercase text-gold mb-1">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-cormorant text-4xl text-charcoal">Dashboard Overview</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <div key={card.label} className="bg-white border border-beige-200 p-6 shadow-sm hover:shadow-jazma transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`text-2xl p-2 rounded-none ${card.color} inline-flex`}>
                  {card.icon}
                </div>
              </div>
              <div className="font-cormorant text-3xl text-charcoal mb-1">{card.value}</div>
              <div className="font-inter text-xs tracking-widest uppercase text-beige-300">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Placeholder panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white border border-beige-200 p-6">
            <h2 className="font-cormorant text-xl text-charcoal mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
            <a href="/admin/orders" className="btn-ghost mt-4 text-terracotta text-xs tracking-widest uppercase block text-right">
              View all orders →
            </a>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white border border-beige-200 p-6">
            <h2 className="font-cormorant text-xl text-charcoal mb-4">Low Stock Alerts</h2>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
            <a href="/admin/inventory" className="btn-ghost mt-4 text-terracotta text-xs tracking-widest uppercase block text-right">
              View inventory →
            </a>
          </div>
        </div>

        {/* Coming soon note */}
        <div className="mt-8 p-4 border border-gold/30 bg-gold-50 flex items-center justify-center gap-3">
          <Wrench className="w-4 h-4 text-gold-400" />
          <p className="font-inter text-xs text-gold-400 tracking-widest uppercase text-center">
            Full admin features coming in the next phases — products, inventory, orders, POS, reports
          </p>
        </div>
      </main>
    </div>
  );
}
