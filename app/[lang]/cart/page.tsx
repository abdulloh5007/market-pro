"use client";

import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/components/cart/CartItem";
import { OrderedItemCard } from "@/app/components/cart/OrderedItemCard";
import { CartSummary } from "@/app/components/cart/CartSummary";
import { PromoCodeCard } from "@/app/components/cart/PromoCodeCard";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/app/components/common/Modal";
import { AnimationPlayer } from "@/app/components/common/AnimationPlayer";
import { getCartItemKey } from "@/app/context/CartContext";
import { useParams } from "next/navigation";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [dictionary, setDictionary] = useState<any>({});
  const params = useParams<{ lang?: string }>();
  const langParam = Array.isArray(params?.lang) ? params?.lang[0] : params?.lang;
  const resolvedLocale = resolveLocale(langParam);
  const [locale, setLocale] = useState<Locale>(resolvedLocale);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [orderPlacedItems, setOrderPlacedItems] = useState<typeof cartItems>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const handlePlaceOrder = () => {
    setOrderPlacedItems(cartItems);
    clearCart();
    setIsOrderSuccessModalOpen(true);
  };

  const handlePromoCodeApplied = (code: string) => {
    if (code.toUpperCase() === "MARKET") {
      setAppliedPromoCode("MARKET");
      setPromoMessage(dictionary.cart?.promoCodeApplied || "Promo code applied! 50% discount");
    } else {
      setPromoMessage(dictionary.cart?.invalidPromoCode || "Invalid promo code");
      setAppliedPromoCode("");
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLocale(resolvedLocale);
      const dict = await getDictionary(resolvedLocale);
      setDictionary(dict);
    }
    fetchData();
  }, [resolvedLocale]);

  if (Object.keys(dictionary).length === 0) {
    return null; // Or a loading spinner
  }

  const noItemsAnimationUrl = "/animations/cart/noItems.tgs";

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
                  key={getCartItemKey(item.product.id, item.selectedVariants)}
                  item={item}
                  dictionary={dictionary}
                  lang={locale}
                />
              ))}
            </div>
            <div>
              <PromoCodeCard
                dictionary={dictionary}
                onPromoCodeApplied={handlePromoCodeApplied}
                appliedPromoCode={appliedPromoCode}
                promoMessage={promoMessage}
              />
              <CartSummary
                dictionary={dictionary}
                onPlaceOrder={handlePlaceOrder}
                appliedPromoCode={appliedPromoCode}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-center sm:mt-6">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8">
                <AnimationPlayer src={noItemsAnimationUrl} loop={true} autoplay={true} />
              </div>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                {dictionary.cart?.empty || "Ваша корзина пуста."}
              </p>
            </div>
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
                      key={getCartItemKey(item.product.id, item.selectedVariants)}
                      item={item}
                      dictionary={dictionary}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOrderSuccessModalOpen(false)}
              className="mt-8 w-full rounded-lg py-3 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-purple-300 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] dark:focus:ring-purple-900 transition-all duration-300 transform cursor-pointer"
            >
              {dictionary.cart?.continueShopping || "Продолжить покупки"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
