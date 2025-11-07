"use client";

import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/components/cart/CartItem";
import { CartSummary } from "@/app/components/cart/CartSummary";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { useState, useEffect, use as useReact } from "react";
import Link from "next/link";

type CartPageProps = {
  params: Promise<{
    lang?: string;
  }>;
};

export default function CartPage({ params: paramsPromise }: CartPageProps) {
  const { cartItems } = useCart();
  const [dictionary, setDictionary] = useState<any>({});
  const [locale, setLocale] = useState<Locale>("ru");

  const params = useReact(paramsPromise);

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

        <h1 className="text-3xl font-bold mb-8">
          {dictionary.header?.cart || "Корзина"}
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  dictionary={dictionary}
                  lang={locale}
                />
              ))}
            </div>
            <div>
              <CartSummary dictionary={dictionary} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              {dictionary.cart?.empty || "Ваша корзина пуста."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
