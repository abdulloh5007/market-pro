'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductById, Product } from '@/lib/products';
import { ProductCard } from '@/app/components/product';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { resolveLocale, type Locale } from '@/lib/i18n/config';
import { AnimationPlayer } from '@/app/components/common/AnimationPlayer';

type FavoritesPageProps = {
  params: {
    lang?: string;
  };
};

export default function FavoritesPage({ params }: FavoritesPageProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [dictionary, setDictionary] = useState<any>({});
  const [locale, setLocale] = useState<Locale>('ru');

  useEffect(() => {
    async function fetchData() {
      const { lang } = await params;
      const resolvedLocale = resolveLocale(lang);
      setLocale(resolvedLocale);
      const dict = await getDictionary(resolvedLocale);
      setDictionary(dict);
    }
    fetchData();
  }, [params]);

  useEffect(() => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

    async function fetchFavoriteProducts() {
      const products = await Promise.all(
        favoriteIds.map((id: string) => getProductById(id))
      );
      setFavoriteProducts(products.filter((p) => p !== null) as Product[]);
    }

    fetchFavoriteProducts();
  }, []);

  const noLikedAnimationUrl = "/animations/favourites/noLiked.tgs";

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <nav className="flex mb-4 sm:mb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            href={`/${locale}`}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            {dictionary.product?.home || 'Главная'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-neutral-100 line-clamp-1">
            {dictionary.favorites?.title || 'Избранные товары'}
          </span>
        </nav>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={product.photos[0]}
                dictionary={dictionary}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex justify-center sm:mt-6">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8">
                <AnimationPlayer src={noLikedAnimationUrl} loop={true} autoplay={true} />
              </div>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                {dictionary.favorites?.empty || 'У вас пока нет избранных товаров.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
