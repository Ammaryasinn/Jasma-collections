"use client";

import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loader2, Trash2, Search, Wrench, ShoppingBag } from "lucide-react";

export default function POSPage() {
  const { data: session } = useSession();
  
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [error, setError] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "MPESA">("CASH");
  const [mpesaRef, setMpesaRef] = useState("");
  
  const [receiptData, setReceiptData] = useState<any>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    setError("");
    setIsScanning(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/variants/barcode/${barcodeInput.trim()}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Item not found");
      
      const variant = data.data.variant;
      
      // Check if we have stock in our shop
      const myShopInventory = variant.inventory.find((i: any) => i.shopId === session?.user?.shopId);
      if (!myShopInventory || myShopInventory.quantity <= 0) {
        throw new Error("Item is out of stock in this shop");
      }
      
      // Add to cart
      setCart(prev => {
        const existing = prev.find(item => item.id === variant.id);
        if (existing) {
          if (existing.quantity >= myShopInventory.quantity) {
            throw new Error(`Only ${myShopInventory.quantity} available in stock`);
          }
          return prev.map(item => item.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...variant, quantity: 1, maxStock: myShopInventory.quantity }];
      });
      
      setBarcodeInput("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
      // Keep focus on input for continuous scanning
      barcodeRef.current?.focus();
    }
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.id !== variantId));
  };

  const updateQuantity = (variantId: string, newQty: number) => {
    if (newQty <= 0) return removeFromCart(variantId);
    
    setCart(prev => prev.map(item => {
      if (item.id === variantId) {
        if (newQty > item.maxStock) {
          setError(`Only ${item.maxStock} available for ${item.product.name}`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    setError("");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({ variantId: item.id, quantity: item.quantity })),
          paymentMethod,
          mpesaRef: paymentMethod === "MPESA" ? mpesaRef : undefined
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      
      // Success! Show receipt
      setReceiptData({
        items: [...cart],
        total: cartTotal,
        method: paymentMethod,
        ref: mpesaRef,
        date: new Date(),
        staff: session?.user?.name
      });
      
      // Clear cart
      setCart([]);
      setMpesaRef("");
      setBarcodeInput("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Receipt Modal
  if (receiptData) {
    return (
      <div className="min-h-screen bg-charcoal-300 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="font-cormorant text-2xl tracking-widest text-charcoal">JASMA</h1>
            <p className="font-inter text-xs text-charcoal-100">Gateway Mall</p>
            <p className="font-inter text-[10px] text-beige-300 mt-2">
              {receiptData.date.toLocaleString()}
            </p>
            <p className="font-inter text-[10px] text-beige-300">
              Cashier: {receiptData.staff}
            </p>
          </div>
          
          <div className="border-t border-b border-dashed border-beige-200 py-4 mb-4 space-y-3">
            {receiptData.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs font-inter">
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-charcoal-100">{item.size} - {item.color} x{item.quantity}</div>
                </div>
                <div>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between font-cormorant text-xl text-charcoal mb-6">
            <span>Total</span>
            <span>{formatCurrency(receiptData.total)}</span>
          </div>
          
          <div className="text-xs font-inter text-charcoal-100 mb-8">
            <p>Paid via: <span className="font-medium">{receiptData.method}</span></p>
            {receiptData.ref && <p>Ref: <span className="font-medium">{receiptData.ref}</span></p>}
          </div>
          
          <button 
            onClick={() => setReceiptData(null)}
            className="btn-primary w-full"
          >
            New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-300 text-cream flex flex-col">
      {/* Header */}
      <header className="bg-charcoal border-b border-gold/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-cormorant text-xl text-cream tracking-widest">JASMA</div>
          <div className="w-px h-5 bg-gold/30" />
          <span className="font-inter text-xs tracking-widest uppercase text-gold">Point of Sale</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-inter text-sm text-cream">{session?.user?.name}</div>
            <div className="font-inter text-xs text-beige-300">{session?.user?.role}</div>
          </div>
          <div className="w-8 h-8 bg-terracotta flex items-center justify-center text-white font-cormorant font-semibold">
            {session?.user?.name?.[0] ?? "S"}
          </div>
          <button onClick={() => signOut()} className="btn-ghost text-red-400 hover:text-red-300 text-xs tracking-widest uppercase">
            Sign out
          </button>
        </div>
      </header>

      {/* Main POS area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        
        {/* Left — Product search / scan */}
        <div className="flex-1 p-6 border-r border-white/10 flex flex-col overflow-y-auto">
          <h2 className="font-cormorant text-2xl text-cream mb-6">Scan Barcode</h2>

          {/* Barcode input */}
          <form onSubmit={handleScan} className="mb-6 relative">
            <input
              ref={barcodeRef}
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan barcode or type exact code..."
              className="w-full pl-12 pr-4 py-4 bg-charcoal-200 border border-white/20 text-cream placeholder:text-beige-300 text-sm font-mono focus:outline-none focus:border-gold transition-colors"
              autoFocus
              disabled={isScanning}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-sm font-inter">
              {error}
            </div>
          )}

          {/* Recently Added Items Display */}
          <div className="flex-1 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="p-4 bg-charcoal-200 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-inter font-medium text-cream">{item.product.name}</div>
                  <div className="text-xs text-beige-300 mt-1">{item.size} — {item.color} ({item.barcode})</div>
                </div>
                <div className="font-cormorant text-xl text-gold">
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Cart / Sale summary */}
        <div className="w-full lg:w-96 p-6 bg-charcoal-200 flex flex-col h-[calc(100vh-73px)]">
          <h2 className="font-cormorant text-2xl text-cream mb-6">Current Sale</h2>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="w-16 h-16 border-2 border-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-white/20" />
                </div>
                <p className="font-inter text-sm text-beige-300">Cart is empty</p>
                <p className="font-inter text-xs text-white/30 mt-1">Scan a barcode to add items</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-charcoal-100 p-3 border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-inter text-sm text-cream leading-tight">{item.product.name}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-beige-300">{item.size} - {item.color}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-charcoal-300 text-white flex items-center justify-center">-</button>
                      <span className="font-mono text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-charcoal-300 text-white flex items-center justify-center">+</button>
                    </div>
                    <span className="font-medium text-gold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment methods & Total */}
          <div className="pt-6 border-t border-white/10 mt-4">
            
            <div className="flex justify-between items-end mb-6">
              <span className="font-inter text-sm text-beige-300 tracking-widest uppercase">Total</span>
              <span className="font-cormorant text-4xl text-cream leading-none">{formatCurrency(cartTotal)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["CASH", "MPESA", "CARD"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 text-xs font-inter tracking-widest uppercase border transition-colors ${
                    paymentMethod === method 
                      ? "border-gold text-gold bg-gold/10" 
                      : "border-white/20 text-beige-300 hover:border-gold/50"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {paymentMethod === "MPESA" && (
              <input 
                type="text" 
                placeholder="M-Pesa Transaction Ref (Optional)" 
                value={mpesaRef}
                onChange={(e) => setMpesaRef(e.target.value)}
                className="w-full px-4 py-2 mb-4 bg-charcoal border border-white/20 text-cream placeholder:text-beige-300 text-xs font-inter focus:outline-none focus:border-gold"
              />
            )}

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className={`w-full py-4 font-inter text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                cart.length === 0 
                  ? "bg-charcoal border border-white/10 text-white/30 cursor-not-allowed" 
                  : "bg-gold text-charcoal hover:bg-gold-600 font-semibold"
              }`}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Sale"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
