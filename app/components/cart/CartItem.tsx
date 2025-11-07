"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/lib/products";

interface CartItemProps {
  item: Product & { quantity: number };
  dictionary: any;
  lang: string;
}

export function CartItem({ item, dictionary, lang }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.photos && item.photos.length > 0 ? item.photos[0] : "/placeholder-image.png"}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <Link href={`/${lang}/product/${item.id}`} className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-purple-600 dark:hover:text-purple-400">
          {item.name}
        </Link>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {item.price} {dictionary.currency}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 sm:gap-2 border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              readOnly
              className="
                w-16 rounded-md border-none bg-white px-2 py-1 text-center
                dark:bg-neutral-800
                appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-moz-appearance]:textfield
                outline-none
              "
            />
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            {dictionary.cart?.remove || "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}
