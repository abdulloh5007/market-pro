"use client";

import { useCart } from "@/app/context/CartContext";

interface CartSummaryProps {
  dictionary: any;
  onPlaceOrder: () => void;
}

export function CartSummary({ dictionary, onPlaceOrder }: CartSummaryProps) {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      item.product.price *
      (1 - (item.product.discount || 0) / 100) *
      item.quantity;
    return acc + price;
  }, 0);

  return (
    <div className="rounded-lg bg-neutral-100 p-6 dark:bg-neutral-800">
      <div className="flex justify-between mb-2">
        <span>{dictionary.cart?.subtotal || "Подытог"}</span>
        <span>
          {subtotal} {dictionary.currency}
        </span>
      </div>
      <div className="flex justify-between mb-4">
        <span>{dictionary.cart?.shipping || "Доставка"}</span>
        <span>{dictionary.cart?.free || "Бесплатно"}</span>
      </div>
      <div className="flex justify-between font-bold text-lg mb-6">
        <span>{dictionary.cart?.total || "Всего"}</span>
        <span>
          {subtotal} {dictionary.currency}
        </span>
      </div>
      <button
        onClick={onPlaceOrder}
        disabled={cartItems.length === 0}
        className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:bg-neutral-400 cursor-pointer transition-all duration-300 transform"
      >
        {dictionary.cart?.checkout || "Оформить заказ"}
      </button>
    </div>
  );
}
