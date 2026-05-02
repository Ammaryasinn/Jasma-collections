import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockInModal({ isOpen, onClose, onSuccess }: StockInModalProps) {
  const { data: session } = useSession();
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variantId, setVariantId] = useState("");
  const [shopId, setShopId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchShops();
      fetchProducts();
    }
  }, [isOpen]);

  // When product changes, update available variants
  useEffect(() => {
    if (selectedProduct) {
      const prod = products.find((p) => p.id === selectedProduct);
      setVariants(prod?.variants || []);
      setVariantId("");
    } else {
      setVariants([]);
      setVariantId("");
    }
  }, [selectedProduct, products]);

  const fetchShops = async () => {
    try {
      // In a real app we'd have a /api/shops route. For now, fetch from inventory or hardcode
      // Wait, we can get shops from /api/inventory or we can just fetch /api/shops if it existed.
      // Let's assume we can fetch them via a generic request or we have them in the session if we are a manager.
      // Actually, we don't have a /api/shops endpoint yet! 
      // Let's hardcode for the MVP, or we can fetch products and extract shops from their inventory.
    } catch (err) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        
        // Hack: extract shops from the first inventory item we find
        const foundShops = new Map();
        data.data.products.forEach((p: any) => {
          p.variants.forEach((v: any) => {
            v.inventory.forEach((i: any) => {
              if (i.shop) foundShops.set(i.shopId, i.shop);
            });
          });
        });
        setShops(Array.from(foundShops.values()));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/stock-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          variantId,
          shopId,
          quantity: parseInt(quantity),
          reference: reference || undefined,
          note: note || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to stock in");

      // Reset
      setSelectedProduct("");
      setVariantId("");
      setShopId("");
      setQuantity("");
      setReference("");
      setNote("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
      <div className="bg-white border border-beige-200 w-full max-w-lg shadow-jasma">
        <div className="flex items-center justify-between p-6 border-b border-beige-100">
          <h2 className="font-cormorant text-2xl text-charcoal">Receive Stock</h2>
          <button onClick={onClose} className="text-beige-300 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Product *</label>
            <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="input-field">
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Variant (Size/Color) *</label>
            <select required value={variantId} onChange={(e) => setVariantId(e.target.value)} disabled={!selectedProduct} className="input-field">
              <option value="">Select a variant</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>{v.size} — {v.color} ({v.barcode})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Destination Shop *</label>
              <select required value={shopId} onChange={(e) => setShopId(e.target.value)} className="input-field">
                <option value="">Select shop</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Quantity *</label>
              <input type="number" required min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Supplier Reference (Optional)</label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. SHIP-2024-001" className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Note</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="input-field" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-32 flex justify-center">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
