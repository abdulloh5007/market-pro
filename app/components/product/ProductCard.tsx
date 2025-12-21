"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Modal } from "@/app/components/common/Modal";
import { QuickView } from "./QuickView";
import { emitFavoritesUpdated } from "@/lib/favorites";
import { Product, getLocalizedDescription } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  imageUrl: string;
  dictionary: {
    currency: string;
    addToCart: string;
  };
}

export function ProductCard({ product, imageUrl, dictionary }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const lang = params?.lang || "ru";

  useEffect(() => {
    // Загружаем избранное из localStorage при монтировании
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsLiked(favorites.includes(product.id));
  }, [product.id]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Clean up on unmount
    };
  }, [isModalOpen]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites: string[];

    if (isLiked) {
      // Удаляем из избранного
      newFavorites = favorites.filter((id: string) => id !== product.id);
    } else {
      // Добавляем в избранное
      newFavorites = [...favorites, product.id];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsLiked(!isLiked);
    // notify others (e.g., Header) immediately
    emitFavoritesUpdated(newFavorites.length);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Link href={`/${lang}/product/${product.id}`} className="group flex flex-col rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl">
        <div className="relative h-48 sm:h-40 md:h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {product.discount && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold py-0.5 px-1.5 sm:py-1 sm:px-2 rounded">
              -{product.discount}%
            </div>
          )}
          <button
            onClick={toggleLike}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10 touch-manipulation"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isLiked ? "#ef4444" : "none"}
              stroke={isLiked ? "#ef4444" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 transition-all duration-300"
            >
              <path d="M12 18L10.9384 17.0503C6.8 13.4 4 11 4 8C4 5.6 5.6 4 8 4C9.4 4 10.8 4.6 12 5.8C13.2 4.6 14.6 4 16 4C18.4 4 20 5.6 20 8C20 11 17.2 13.4 13.0616 17.0503L12 18Z" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col flex-grow p-2 sm:p-3 md:p-4 bg-white dark:bg-neutral-900">
          <div className="mt-auto pt-1 sm:pt-2">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
                {product.price} {dictionary.currency}
              </p>
              {product.discount && (
                <p className="text-xs sm:text-sm text-gray-500 line-through flex-shrink-0">
                  {Math.round(product.price / (1 - product.discount / 100))} {dictionary.currency}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 h-8 sm:h-10 mt-1 overflow-hidden line-clamp-2">
            {getLocalizedDescription(product.description, String(lang))}
          </p>
          <button 
            onClick={handleAddToCartClick}
            className="mt-2 sm:mt-3 md:mt-4 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm md:text-base font-bold py-1 sm:py-1.5 rounded-lg transform hover:scale-103 transition-all duration-200 cursor-pointer"
            type="button"
          >
            {dictionary.addToCart}
          </button>
        </div>
      </Link>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <QuickView product={product} dictionary={dictionary} />
      </Modal>
    </>
  );
}
