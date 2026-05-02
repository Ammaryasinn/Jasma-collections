"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/products", process.env.NEXT_PUBLIC_API_URL);
      if (search) url.searchParams.set("search", search);
      
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-charcoal">Products</h1>
          <p className="font-inter text-sm text-beige-300 mt-1">
            Manage your catalog, variants, and barcodes
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-beige-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-300" />
          <input
            type="text"
            placeholder="Search products by name..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/barcodes" className="btn-secondary w-full sm:w-auto">
            Print Barcodes
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-beige-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-sm">
            <thead className="bg-cream border-b border-beige-200 text-charcoal-100 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Variants</th>
                <th className="px-6 py-4 font-medium">Total Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="skeleton h-5 w-48" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-5 w-24" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-5 w-16" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-5 w-16" /></td>
                    <td className="px-6 py-4"><div className="skeleton h-5 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-beige-300">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants.reduce(
                    (sum: number, variant: any) =>
                      sum + variant.inventory.reduce((s: number, inv: any) => s + inv.quantity, 0),
                    0
                  );

                  return (
                    <tr key={product.id} className="hover:bg-cream/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-cream border border-beige-200 flex items-center justify-center overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-beige-300" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-charcoal group-hover:text-terracotta transition-colors">
                              {product.name}
                            </div>
                            <div className="text-xs text-charcoal-100 uppercase tracking-wider mt-1">
                              {product.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-charcoal-100">
                        {product.category?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-terracotta">
                          {product.variants.length} Variants
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${totalStock < 10 ? "text-red-500" : "text-green-600"}`}>
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-1.5 text-terracotta hover:text-terracotta-400 font-medium tracking-wide uppercase text-xs"
                        >
                          Manage
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
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
