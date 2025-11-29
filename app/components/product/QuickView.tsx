"use client";

import { useState } from "react";
import { Product, calculatePrice } from "@/lib/products";
import { ProductImageGallery, ProductVariants, ProductActions } from ".";

interface QuickViewProps {
  product: Product;
  dictionary: any;
}

export function QuickView({ product, dictionary }: QuickViewProps) {
  const [selectedVariants, setSelectedVariants] = useState<{
    memory?: string;
    color?: string;
    size?: string;
  }>({
    memory: Array.isArray(product.memory) ? product.memory[0] : product.memory,
    color: Array.isArray(product.color) ? product.color[0] : product.color,
    size: product.size && product.size.length > 0 ? product.size[0] : undefined,
  });

  const currentPrice = calculatePrice(product, selectedVariants);
  const originalPrice = product.discount
    ? Math.round(currentPrice / (1 - product.discount / 100))
    : null;

  const handleVariantChange = (variants: { memory?: string; color?: string; size?: string }) => {
    setSelectedVariants(variants);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full mt-3">
            <ProductImageGallery images={product.photos} productName={product.name} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-neutral-300 dark:text-neutral-600"
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {product.rating} ({product.comments?.length || 0}{" "}
                {dictionary.product?.reviews || "отзывов"})
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {currentPrice} {dictionary.currency}
                </span>
                {product.discount && (
                  <span className="text-xl text-red-600 dark:text-red-400 font-semibold">
                    -{product.discount}%
                  </span>
                )}
              </div>
              {originalPrice && (
                <p className="text-lg text-neutral-500 dark:text-neutral-400 line-through">
                  {originalPrice} {dictionary.currency}
                </p>
              )}
            </div>
            <div className="mb-6">
              <ProductVariants
                product={product}
                dictionary={dictionary}
                onVariantChange={handleVariantChange}
              />
            </div>
            <div className="hidden md:block">
              <ProductActions
                product={product}
                dictionary={dictionary}
                selectedVariants={selectedVariants}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden w-full mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <ProductActions
          product={product}
          dictionary={dictionary}
          selectedVariants={selectedVariants}
          currentPrice={currentPrice}
        />
      </div>

    </div>
  );
}
