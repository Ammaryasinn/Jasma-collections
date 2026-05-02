"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, ArrowRightLeft, Plus, Settings2 } from "lucide-react";
import { StockInModal } from "@/components/admin/StockInModal";
import { StockTransferModal } from "@/components/admin/StockTransferModal";
import { StockAdjustModal } from "@/components/admin/StockAdjustModal";

export default function InventoryPage() {
  const { data: session } = useSession();
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferItem, setTransferItem] = useState<any>(null);
  
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<any>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data.inventory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferClick = (item: any) => {
    setTransferItem(item);
    setIsTransferOpen(true);
  };

  const handleAdjustClick = (item: any) => {
    setAdjustItem(item);
    setIsAdjustOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-charcoal">Inventory</h1>
          <p className="font-inter text-sm text-beige-300 mt-1">
            Manage stock levels across all boutiques and online allocation
          </p>
        </div>
        <button onClick={() => setIsStockInOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Receive Stock
        </button>
      </div>

      <div className="bg-white border border-beige-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-sm">
            <thead className="bg-cream border-b border-beige-200 text-charcoal-100 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4 font-medium">Product & Variant</th>
                <th className="px-6 py-4 font-medium">Barcode</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-right">Quantity</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-terracotta">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-beige-300">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const isLowStock = item.quantity <= item.lowStockThreshold;
                  const isOutOfStock = item.quantity === 0;

                  return (
                    <tr key={item.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{item.variant.product.name}</div>
                        <div className="text-xs text-charcoal-100 mt-1">
                          {item.variant.size} — {item.variant.color}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-charcoal">
                        {item.variant.barcode}
                      </td>
                      <td className="px-6 py-4 text-charcoal">
                        {item.shop ? item.shop.name : "Online Store"}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-charcoal">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isOutOfStock ? (
                          <span className="px-2 py-1 text-[10px] uppercase tracking-widest bg-red-100 text-red-800 rounded-full">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="px-2 py-1 text-[10px] uppercase tracking-widest bg-gold-100 text-gold-800 rounded-full">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 text-[10px] uppercase tracking-widest bg-green-100 text-green-800 rounded-full">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleTransferClick(item)}
                            className="text-terracotta hover:text-charcoal transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest"
                            disabled={isOutOfStock}
                            title="Transfer Stock"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleAdjustClick(item)}
                            className="text-terracotta hover:text-charcoal transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest"
                            title="Adjust Stock"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StockInModal 
        isOpen={isStockInOpen} 
        onClose={() => setIsStockInOpen(false)} 
        onSuccess={() => { setIsStockInOpen(false); fetchInventory(); }} 
      />
      
      <StockTransferModal 
        isOpen={isTransferOpen} 
        inventoryItem={transferItem}
        onClose={() => { setIsTransferOpen(false); setTransferItem(null); }} 
        onSuccess={() => { setIsTransferOpen(false); setTransferItem(null); fetchInventory(); }} 
      />
      
      <StockAdjustModal 
        isOpen={isAdjustOpen} 
        inventoryItem={adjustItem}
        onClose={() => { setIsAdjustOpen(false); setAdjustItem(null); }} 
        onSuccess={() => { setIsAdjustOpen(false); setAdjustItem(null); fetchInventory(); }} 
      />
    </div>
  );
}
