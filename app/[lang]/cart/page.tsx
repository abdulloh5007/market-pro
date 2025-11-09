"use client";

import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/components/cart/CartItem";
import { OrderedItemCard } from "@/app/components/cart/OrderedItemCard";
import { CartSummary } from "@/app/components/cart/CartSummary";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { useState, useEffect, use as useReact } from "react";
import Link from "next/link";
import { Modal } from "@/app/components/common/Modal";
import { AnimationPlayer } from "@/app/components/common/AnimationPlayer";

type CartPageProps = {
  params: Promise<{
    lang?: string;
  }>;
};

export default function CartPage({ params: paramsPromise }: CartPageProps) {
  const { cartItems, clearCart } = useCart();
  const [dictionary, setDictionary] = useState<any>({});
  const [locale, setLocale] = useState<Locale>("ru");
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [orderPlacedItems, setOrderPlacedItems] = useState<typeof cartItems>([]);

  const params = useReact(paramsPromise);

  const handlePlaceOrder = () => {
    setOrderPlacedItems(cartItems);
    clearCart();
    setIsOrderSuccessModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      const lang = params.lang;
      const resolvedLocale = resolveLocale(lang);
      setLocale(resolvedLocale);
      const dict = await getDictionary(resolvedLocale);
      setDictionary(dict);
    }
    fetchData();
  }, [params]);

  if (Object.keys(dictionary).length === 0) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <nav className="flex mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            href={`/${locale}`}
            className="hover:text-purple-600 dark:hover:text-purple-400"
          >
            {dictionary.product?.home || "Главная"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {dictionary.header?.cart || "Корзина"}
          </span>
        </nav>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  dictionary={dictionary}
                  lang={locale}
                />
              ))}
            </div>
            <div>
              <CartSummary dictionary={dictionary} onPlaceOrder={handlePlaceOrder} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              {dictionary.cart?.empty || "Ваша корзина пуста."}
            </p>
          </div>
        )}

        <Modal
          isOpen={isOrderSuccessModalOpen}
          onClose={() => setIsOrderSuccessModalOpen(false)}
        >
          <div className="flex flex-col items-center justify-center p-6">
            <AnimationPlayer
              src="/animations/cart/orderSuccess.tgs"
              loop={true}
              autoplay={true}
              className="w-32 h-32"
            />
            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {dictionary.cart?.orderSuccessTitle || "Заказ успешно оформлен!"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 text-center">
              {dictionary.cart?.orderSuccessMessage ||
                "Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время."}
            </p>

            {orderPlacedItems.length > 0 && (
              <div className="mt-6 w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  {dictionary.cart?.orderedItems || "Заказанные товары:"}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {orderPlacedItems.map((item) => (
                    <OrderedItemCard
                      key={item.product.id}
                      item={item}
                      dictionary={dictionary}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOrderSuccessModalOpen(false)}
              className="mt-8 w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-900 transition-all duration-300 transform cursor-pointer"
            >
              {dictionary.cart?.continueShopping || "Продолжить покупки"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
