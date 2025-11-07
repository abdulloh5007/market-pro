"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";

interface ProductActionsProps {
  product: Product;
  dictionary: any;
}

export function ProductActions({ product, dictionary }: ProductActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsLiked(favorites.includes(product.id));
  }, [product.id]);

  const toggleLike = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites: string[];

    if (isLiked) {
      newFavorites = favorites.filter((id: string) => id !== product.id);
    } else {
      newFavorites = [...favorites, product.id];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsLiked(!isLiked);
  };

  const handleAddToCart = () => {
    // Здесь можно добавить логику добавления в корзину
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: product.id, quantity, product });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // Можно добавить уведомление об успешном добавлении
    alert(dictionary.product?.addedToCart || "Товар добавлен в корзину");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Количество */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {dictionary.product?.quantity || "Количество"}:
        </span>
        <div className="flex items-center gap-1 sm:gap-2 border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95"
            type="button"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-3 sm:px-4 py-2 text-neutral-900 dark:text-neutral-100 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= product.quantity}
            className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95"
            type="button"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none text-sm sm:text-base"
          type="button"
        >
          {dictionary.addToCart || "В корзину"}
        </button>
        <button
          onClick={toggleLike}
          className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isLiked
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md"
              : "border-neutral-300 dark:border-neutral-600 hover:border-red-300 dark:hover:border-red-700 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/10"
          }`}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          type="button"
        >
          <svg
            width="20"
            height="20"
            className="sm:w-6 sm:h-6"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          >
            <path d="M12 18L10.9384 17.0503C6.8 13.4 4 11 4 8C4 5.6 5.6 4 8 4C9.4 4 10.8 4.6 12 5.8C13.2 4.6 14.6 4 16 4C18.4 4 20 5.6 20 8C20 11 17.2 13.4 13.0616 17.0503L12 18Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

