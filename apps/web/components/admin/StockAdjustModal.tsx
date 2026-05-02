import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inventoryItem?: any;
}

export function StockAdjustModal({ isOpen, onClose, onSuccess, inventoryItem }: StockAdjustModalProps) {
  const { data: session } = useSession();
  
  const [adjustment, setAdjustment] = useState("");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!inventoryItem) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          variantId: inventoryItem.variantId,
          shopId: inventoryItem.shopId,
          adjustment: parseInt(adjustment),
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to adjust stock");

      setAdjustment("");
      setNote("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !inventoryItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
      <div className="bg-white border border-beige-200 w-full max-w-lg shadow-jasma">
        <div className="flex items-center justify-between p-6 border-b border-beige-100">
          <h2 className="font-cormorant text-2xl text-charcoal">Adjust Stock</h2>
          <button onClick={onClose} className="text-beige-300 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <div className="p-3 bg-cream border border-beige-200 text-sm font-inter">
            <strong>{inventoryItem.variant.product.name}</strong>
            <div>Location: {inventoryItem.shop?.name || "Online"}</div>
            <div className="mt-1 text-terracotta">Current Stock: {inventoryItem.quantity}</div>
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Adjustment *</label>
            <p className="text-xs text-beige-300 mb-2">Use negative numbers to reduce stock (e.g. -2) and positive to increase.</p>
            <input type="number" required value={adjustment} onChange={(e) => setAdjustment(e.target.value)} placeholder="-1" className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">Reason for adjustment *</label>
            <input type="text" required value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Damaged item, physical count correction" className="input-field" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-32 flex justify-center">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adjust"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
