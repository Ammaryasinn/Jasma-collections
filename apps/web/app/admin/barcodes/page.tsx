"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Barcode from "react-barcode";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";

export default function BarcodesPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State to track how many of each barcode to print
  const [printQuantities, setPrintQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (variantId: string, value: number) => {
    setPrintQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(0, value),
    }));
  };

  // Generate an array of variants to print based on selected quantities
  const variantsToPrint = products.flatMap((p) =>
    p.variants.flatMap((v: any) => {
      const q = printQuantities[v.id] || 0;
      return Array.from({ length: q }).map(() => ({
        ...v,
        productName: p.name,
      }));
    })
  );

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-terracotta" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* ─── Screen View (Hidden during print) ─── */}
      <div className="print:hidden">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link href="/admin/products" className="inline-flex items-center gap-2 text-beige-300 hover:text-charcoal transition-colors mb-4 text-sm font-inter">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <h1 className="font-cormorant text-3xl text-charcoal">Print Barcodes</h1>
            <p className="font-inter text-sm text-beige-300 mt-1">
              Select quantities for A4 sticker sheet printing
            </p>
          </div>
          <button 
            onClick={handlePrint}
            disabled={variantsToPrint.length === 0}
            className="btn-primary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print {variantsToPrint.length} Labels
          </button>
        </div>

        <div className="bg-white border border-beige-200 p-6 mb-8">
          <table className="w-full text-left font-inter text-sm">
            <thead className="bg-cream text-charcoal-100 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Variant</th>
                <th className="px-4 py-3 font-medium">SKU / Barcode</th>
                <th className="px-4 py-3 font-medium w-32 text-right">Print Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {products.map((p) =>
                p.variants.map((v: any) => (
                  <tr key={v.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3 font-medium text-charcoal">{p.name}</td>
                    <td className="px-4 py-3">{v.size} — {v.color}</td>
                    <td className="px-4 py-3 font-mono text-xs">{v.barcode}</td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        className="input-field w-20 py-1 text-center"
                        value={printQuantities[v.id] || ""}
                        placeholder="0"
                        onChange={(e) => handleQuantityChange(v.id, parseInt(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Print View (Visible only during print) ─── */}
      <div className="hidden print:grid grid-cols-4 gap-4 w-full" style={{ width: "210mm" }}>
        {variantsToPrint.map((v, index) => (
          <div key={index} className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-2 text-center h-[35mm] overflow-hidden break-inside-avoid">
            <div className="font-inter text-[9px] font-bold uppercase truncate w-full">{v.productName}</div>
            <div className="font-inter text-[8px] text-gray-500 mb-1">{v.size} • {v.color} • KES {v.price}</div>
            <Barcode 
              value={v.barcode} 
              width={1.2} 
              height={30} 
              fontSize={10} 
              margin={0} 
              displayValue={true} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
