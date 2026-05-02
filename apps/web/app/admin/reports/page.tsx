import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  let topSellers = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/top-sellers`, {
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      cache: "no-store"
    });
    const data = await res.json();
    if (data.success) {
      topSellers = data.data.topSellers;
    }
  } catch (err) {
    console.error("Failed to fetch top sellers:", err);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="font-cormorant text-3xl text-charcoal">Analytics & Reports</h1>
        <p className="font-inter text-sm text-beige-300 mt-1">
          Insights into your business performance and top selling items.
        </p>
      </div>
      
      <div className="bg-white border border-beige-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-beige-100">
          <h2 className="font-cormorant text-2xl text-charcoal">Top Sellers (All Time)</h2>
          <p className="font-inter text-xs text-charcoal-100 mt-1">Items with the highest sales volume across all locations.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-sm">
            <thead className="bg-cream border-b border-beige-200 text-charcoal-100 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Variant</th>
                <th className="px-6 py-4 font-medium text-right">Unit Price</th>
                <th className="px-6 py-4 font-medium text-right">Total Sold</th>
                <th className="px-6 py-4 font-medium text-right">Est. Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {topSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-beige-300">
                    No sales data available yet.
                  </td>
                </tr>
              ) : (
                topSellers.map((item: any, idx: number) => {
                  const revenue = item.totalSold * item.price;
                  return (
                    <tr key={item.variantId} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-terracotta">#{idx + 1}</td>
                      <td className="px-6 py-4 text-charcoal font-medium">{item.productName}</td>
                      <td className="px-6 py-4 text-charcoal-100">{item.variantDetails}</td>
                      <td className="px-6 py-4 text-right text-charcoal">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-right font-medium text-charcoal">{item.totalSold}</td>
                      <td className="px-6 py-4 text-right text-gold-600 font-medium">{formatCurrency(revenue)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
