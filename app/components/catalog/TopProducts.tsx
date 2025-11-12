"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "../product/ProductCard";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/lib/products";

const PAGE_SIZE = 10;

const fallbackImages = [
  "/catalog-card-photos/books.png",
  "/catalog-card-photos/clothes.png",
  "/catalog-card-photos/joy.png",
  "/catalog-card-photos/joystick.png",
  "/catalog-card-photos/sports.png",
  "/catalog-card-photos/technics.png",
];

const getProductImage = (product: { photos?: string[] }) => {
  if (product.photos && product.photos.length > 0) {
    return product.photos[0];
  }
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

export default function TopProducts({ dictionary }: { dictionary: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getAllProducts();
      const topRatedProducts = allProducts.sort((a, b) => b.rating - a.rating);
      setProducts(topRatedProducts);
    };
    fetchProducts();
  }, []);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="py-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{dictionary.topRatedProducts}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            imageUrl={getProductImage(product)}
            dictionary={dictionary}
          />
        ))}
      </div>
      {products.length > visibleCount && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-lg bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
          >
            {dictionary.header?.show_more || "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
