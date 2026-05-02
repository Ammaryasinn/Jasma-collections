"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Loader2, UploadCloud, Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // Variant Form State
  const [vSize, setVSize] = useState("");
  const [vColor, setVColor] = useState("");
  const [vPrice, setVPrice] = useState("");

  const productId = params.id as string;

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data.product);
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Image Upload using Dropzone
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setIsUploading(true);
    
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);

      // 1. Upload to Cloudinary via our backend
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");

      // 2. Update Product record with new image URL
      const newImages = [...(product.images || []), uploadData.data.url];
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ images: newImages }),
      });

      if (updateRes.ok) {
        setProduct({ ...product, images: newImages });
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, [productId, product, session]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          productId,
          size: vSize,
          color: vColor,
          price: parseFloat(vPrice),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVSize("");
        setVColor("");
        setVPrice("");
        setIsAddingVariant(false);
        fetchProduct(); // refresh variants
      } else {
        alert(data.message || "Failed to add variant");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/variants/${variantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        fetchProduct();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-terracotta" /></div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-beige-300 hover:text-charcoal transition-colors mb-4 text-sm font-inter">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="font-cormorant text-3xl text-charcoal">{product.name}</h1>
          <p className="font-inter text-sm text-beige-300 mt-1">
            {product.category?.name} • {product.gender}
          </p>
        </div>
        <button className="btn-secondary text-red-500 hover:text-red-600 hover:border-red-200">
          Deactivate Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-beige-200 p-6">
            <h2 className="font-cormorant text-xl text-charcoal mb-4">Product Images</h2>
            
            {/* Gallery */}
            {product.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.images.map((url: string, i: number) => (
                  <div key={i} className="aspect-square relative group bg-cream">
                    <img src={url} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 bg-white rounded-full text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square bg-cream border border-beige-200 flex flex-col items-center justify-center text-beige-300 mb-4">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-inter">No images yet</span>
              </div>
            )}

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-terracotta bg-terracotta/5" : "border-beige-200 hover:border-gold"
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center text-terracotta">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-xs tracking-widest uppercase">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-beige-300">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs tracking-widest uppercase">Drop image here or click</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Variants */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-beige-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cormorant text-xl text-charcoal">Inventory Variants</h2>
              {!isAddingVariant && (
                <button onClick={() => setIsAddingVariant(true)} className="btn-secondary text-xs px-3 py-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </button>
              )}
            </div>

            {/* Add Variant Form */}
            {isAddingVariant && (
              <form onSubmit={handleAddVariant} className="bg-cream p-4 mb-6 border border-beige-200 flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal-100 mb-1">Size</label>
                  <input type="text" required value={vSize} onChange={e => setVSize(e.target.value)} placeholder="e.g. S, M, 32" className="input-field py-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal-100 mb-1">Color</label>
                  <input type="text" required value={vColor} onChange={e => setVColor(e.target.value)} placeholder="e.g. Red" className="input-field py-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] tracking-widest uppercase text-charcoal-100 mb-1">Price (KES)</label>
                  <input type="number" required value={vPrice} onChange={e => setVPrice(e.target.value)} placeholder="0" className="input-field py-2" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary py-2 px-4">Save</button>
                  <button type="button" onClick={() => setIsAddingVariant(false)} className="btn-secondary py-2 px-3 text-red-500">Cancel</button>
                </div>
              </form>
            )}

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-inter text-sm">
                <thead className="bg-cream text-charcoal-100 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-4 py-3 font-medium">SKU / Barcode</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Color</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-100">
                  {product.variants?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-beige-300">No variants added yet.</td>
                    </tr>
                  ) : (
                    product.variants?.map((v: any) => {
                      const stock = v.inventory?.reduce((sum: number, inv: any) => sum + inv.quantity, 0) || 0;
                      return (
                        <tr key={v.id} className="hover:bg-cream/30">
                          <td className="px-4 py-3 font-mono text-xs text-charcoal">{v.barcode}</td>
                          <td className="px-4 py-3">{v.size}</td>
                          <td className="px-4 py-3">{v.color}</td>
                          <td className="px-4 py-3">KES {v.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => handleDeleteVariant(v.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
