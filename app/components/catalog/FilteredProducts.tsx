"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../product/ProductCard";
import { getProductsByCatalogAndCategory, CatalogType } from "@/lib/products";
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

const getCategoryLabel = (category: string, dictionary?: any) => {
  if (category === "all") return dictionary?.categories?.all || "Все";
  
  // Dynamic category name mapping - can be extended as needed
  const categoryTranslations: Record<string, string> = {
    smartphones: "Смартфоны",
    laptops: "Ноутбуки", 
    airpods: "Наушники",
    headwear: "Головные уборы",
    clothing: "Одежда",
    underwear: "Нижнее белье",
    footwear: "Обувь",
    barbells: "Штанги",
    treadmills: "Беговые дорожки",
    jump_ropes: "Скакалки",
    programming: "Программирование",
    science: "Наука",
  };
  
  return categoryTranslations[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
};

export default function FilteredProducts({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams();
  const catalogParam = searchParams.get("catalog");
  const categoryParam = searchParams.get("category") || "all";
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const catalog = catalogParam as CatalogType | null;

  useEffect(() => {
    const fetchProducts = async () => {
      if (catalog) {
        setLoading(true);
        try {
          const catalogProducts = await getProductsByCatalogAndCategory(catalog, categoryParam);
          const sortedProducts = catalogProducts.sort((a: Product, b: Product) => b.rating - a.rating);
          setProducts(sortedProducts);
          setVisibleCount(PAGE_SIZE);
        } catch (error) {
          console.error("Error fetching catalog products:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]);
        setVisibleCount(PAGE_SIZE);
      }
    };

    fetchProducts();
  }, [catalog, categoryParam]);

  if (!catalog) {
    return null;
  }

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6">
        <div className="py-4 sm:py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            {categoryParam === "all" 
              ? dictionary.categories[catalog] 
              : `${dictionary.categories[catalog]} - ${getCategoryLabel(categoryParam, dictionary)}`
            }
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6">
        <div className="py-4 sm:py-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            {categoryParam === "all" 
              ? dictionary.categories[catalog] 
              : `${dictionary.categories[catalog]} - ${getCategoryLabel(categoryParam, dictionary)}`
            }
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {dictionary.header?.no_products_found || "Товары не найдены"}
          </p>
        </div>
      </section>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <div className="">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
          {categoryParam === "all" 
            ? dictionary.categories[catalog] 
            : `${dictionary.categories[catalog]} - ${getCategoryLabel(categoryParam, dictionary)}`
          }
        </h2>
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
    </section>
  );
}