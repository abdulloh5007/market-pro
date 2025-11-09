import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/lib/products";

interface CartItemProps {
  item: { product: Product; quantity: number };
  dictionary: any;
  lang: string;
}

export function CartItem({ item, dictionary, lang }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 p-4 mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm">
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={
            product.photos && product.photos.length > 0
              ? product.photos[0]
              : "/placeholder-image.png"
          }
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <Link
          href={`/${lang}/product/${product.id}`}
          className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-purple-600 dark:hover:text-purple-400"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <p
            className={`text-lg font-bold ${
              product.discount
                ? "text-red-500"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {discountedPrice} {dictionary.currency}
          </p>
          {product.discount && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
              {product.price} {dictionary.currency}
            </p>
          )}
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {dictionary.cart?.stock || "В наличии"}: {product.quantity}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 sm:gap-2 border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95"
              type="button"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              readOnly
              className="
                w-12 rounded-md border-none bg-white px-2 py-1 text-center
                dark:bg-neutral-800
                appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-moz-appearance]:textfield
                outline-none
              "
            />
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.quantity}
              className="px-2 sm:px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95 cursor-pointer"
              type="button"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            aria-label={dictionary.cart?.remove || "Удалить"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

