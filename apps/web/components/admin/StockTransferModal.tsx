import { useState, useEffect } from "react";
import { Loader2, X, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inventoryItem?: any; // If passed, pre-select this item
}

export function StockTransferModal({ isOpen, onClose, onSuccess, inventoryItem }: StockTransferModalProps) {
  const { data: session } = useSession();
  const [shops, setShops] = useState<any[]>([]);
  
  const [variantId, setVariantId] = useState("");
  const [fromShopId, setFromShopId] = useState("");
  const [toShopId, setToShopId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (inventoryItem) {
        setVariantId(inventoryItem.variantId);
        setFromShopId(inventoryItem.shopId);
      }
      fetchShops();
    }
  }, [isOpen, inventoryItem]);

  const fetchShops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
      });
      const data = await res.json();
      if (data.success) {
        const foundShops = new Map();
        data.data.inventory.forEach((i: any) => {
          if (i.shop) foundShops.set(i.shopId, i.shop);
        });
        setShops(Array.from(foundShops.values()));
      }
    } catch (err) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (fromShopId === toShopId) {
      setError("Cannot transfer to the same shop.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          variantId,
          fromShopId,
          toShopId,
          quantity: parseInt(quantity),
          note: note || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to transfer stock");

      setVariantId("");
      setFromShopId("");
      setToShopId("");
      setQuantity("");
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
          <h2 className="font-cormorant text-2xl text-charcoal">Transfer Stock</h2>
          <button onClick={onClose} className="text-beige-300 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          {inventoryItem && (
            <div className="p-3 bg-cream border border-beige-200 text-sm font-inter">
              <strong>{inventoryItem.variant.product.name}</strong>
              <div>Variant: {inventoryItem.variant.size} — {inventoryItem.variant.color}</div>
              <div className="mt-1 text-terracotta">Current Stock: {inventoryItem.quantity}</div>
            </div>
          )}

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">From *</label>
              <select required value={fromShopId} onChange={(e) => setFromShopId(e.target.value)} disabled={!!inventoryItem} className="input-field">
                <option value="">Select origin</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="pb-3 text-beige-300">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">To *</label>
              <select required value={toShopId} onChange={(e) => setToShopId(e.target.value)} className="input-field">
                <option value="">Select destination</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Quantity to Transfer *</label>
            <input type="number" required min="1" max={inventoryItem?.quantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Transfer Note</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="input-field" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-32 flex justify-center">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
