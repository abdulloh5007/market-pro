"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

interface ProductVariantsProps {
  product: Product;
  dictionary: any;
  onVariantChange?: (variants: { memory?: string; color?: string; size?: string }) => void;
}

export function ProductVariants({ product, dictionary, onVariantChange }: ProductVariantsProps) {
  const [selectedMemory, setSelectedMemory] = useState<string | null>(
    Array.isArray(product.memory) ? product.memory[0] : product.memory || null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    Array.isArray(product.color) ? product.color[0] : product.color || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.size && product.size.length > 0 ? product.size[0] : null
  );

  const handleMemoryChange = (memory: string) => {
    setSelectedMemory(memory);
    onVariantChange?.({ memory, color: selectedColor || undefined, size: selectedSize || undefined });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onVariantChange?.({ memory: selectedMemory || undefined, color, size: selectedSize || undefined });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onVariantChange?.({ memory: selectedMemory || undefined, color: selectedColor || undefined, size });
  };

  const memoryOptions = Array.isArray(product.memory) ? product.memory : (product.memory ? [product.memory] : []);
  const colorOptions = Array.isArray(product.color) ? product.color : (product.color ? [product.color] : []);

  return (
    <div className="space-y-4">
      {/* Выбор памяти (для телефонов и ноутбуков) */}
      {memoryOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {dictionary.product?.memory || "Память"}:
          </label>
          <div className="flex flex-wrap gap-2">
            {memoryOptions.map((memory) => (
              <button
                key={memory}
                onClick={() => handleMemoryChange(memory)}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
                  selectedMemory === memory
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md scale-105"
                    : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105"
                }`}
                type="button"
              >
                {memory}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Выбор цвета */}
      {colorOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {dictionary.product?.color || "Цвет"}:
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
                  selectedColor === color
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md scale-105"
                    : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105"
                }`}
                type="button"
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Выбор размера (для одежды и обуви) */}
      {product.size && product.size.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {dictionary.product?.size || "Размер"}:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.size.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
                  selectedSize === size
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md scale-105"
                    : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105"
                }`}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

