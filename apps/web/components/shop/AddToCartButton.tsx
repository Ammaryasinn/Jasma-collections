"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  color: string;
  price: number;
  inventory: { quantity: number }[];
}

interface AddToCartButtonProps {
  product: any;
  variants: Variant[];
}

export function AddToCartButton({ product, variants }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const stockForVariant = selectedVariant?.inventory[0]?.quantity ?? 0;
  const isOutOfStock = selectedVariant && stockForVariant === 0;

  const handleAddToCart = () => {
    setError("");
    if (!selectedSize) return setError("Please select a size.");
    if (!selectedColor) return setError("Please select a color.");
    if (!selectedVariant) return setError("This combination is unavailable.");
    if (isOutOfStock) return setError("This variant is out of stock online.");

    // Get current cart from localStorage
    const existing = JSON.parse(localStorage.getItem("jasma_cart") || "[]");
    const cartItem = existing.find((i: any) => i.variantId === selectedVariant.id);

    let updated;
    if (cartItem) {
      updated = existing.map((i: any) =>
        i.variantId === selectedVariant.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [
        ...existing,
        {
          variantId: selectedVariant.id,
          productName: product.name,
          image: product.images?.[0] || null,
          size: selectedSize,
          color: selectedColor,
          price: Number(selectedVariant.price),
          quantity: 1,
          maxStock: stockForVariant,
        },
      ];
    }

    localStorage.setItem("jasma_cart", JSON.stringify(updated));

    // Flash success
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="font-cormorant text-4xl text-charcoal">
        {selectedVariant ? formatCurrency(Number(selectedVariant.price)) : formatCurrency(Math.min(...variants.map(v => Number(v.price))))}
      </div>

      {/* Size selector */}
      <div>
        <p className="font-inter text-xs tracking-widest uppercase text-charcoal-100 mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size as string)}
              className={`px-4 py-2 font-inter text-sm border transition-all duration-200 ${
                selectedSize === size
                  ? "bg-charcoal text-cream border-charcoal"
                  : "text-charcoal border-beige-200 hover:border-charcoal"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <p className="font-inter text-xs tracking-widest uppercase text-charcoal-100 mb-3">Colour</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color as string)}
              className={`px-4 py-2 font-inter text-sm border transition-all duration-200 ${
                selectedColor === color
                  ? "bg-charcoal text-cream border-charcoal"
                  : "text-charcoal border-beige-200 hover:border-charcoal"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Stock indicator */}
      {selectedVariant && (
        <p className={`font-inter text-xs ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
          {isOutOfStock ? "Out of stock online" : `${stockForVariant} in stock online`}
        </p>
      )}

      {error && <p className="font-inter text-sm text-red-500">{error}</p>}

      {/* Add to Cart */}
      <button
        id="btn-add-to-cart"
        onClick={handleAddToCart}
        disabled={!!isOutOfStock}
        className={`w-full py-4 font-inter text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
          added
            ? "bg-green-700 text-white"
            : isOutOfStock
            ? "bg-beige-100 text-beige-300 cursor-not-allowed border border-beige-200"
            : "bg-charcoal text-cream hover:bg-terracotta"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
