"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { gender: "WOMEN" },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to create product");
      }

      // Redirect to the edit page to add variants/images
      router.push(`/admin/products/${responseData.data.product.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-beige-300 hover:text-charcoal transition-colors mb-4 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="font-cormorant text-3xl text-charcoal">Create New Product</h1>
        <p className="font-inter text-sm text-beige-300 mt-1">
          Start by providing the basic details. You can add images and variants on the next page.
        </p>
      </div>

      <div className="bg-white border border-beige-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-inter border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Silk Evening Gown"
              className={`input-field ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">
                Category *
              </label>
              <select
                {...register("categoryId")}
                className={`input-field ${errors.categoryId ? "border-red-500 focus:border-red-500" : ""}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">
                Gender *
              </label>
              <select {...register("gender")} className="input-field">
                <option value="WOMEN">Women's</option>
                <option value="MEN">Men's</option>
                <option value="UNISEX">Unisex</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-inter tracking-widest uppercase text-charcoal-100 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Detailed description of the product, materials, care instructions, etc."
              className="input-field resize-none"
            />
          </div>

          <div className="pt-6 border-t border-beige-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full md:w-auto flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
