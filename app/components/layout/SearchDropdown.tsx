"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, getAllProducts } from "@/lib/products";
import { useDebounce } from "@/hooks/useDebounce";

import type { Dictionary } from "@/lib/i18n/get-dictionary";

interface SearchDropdownProps {
  query: string;
  locale: string;
  dictionary: Dictionary;
  onClose: () => void;
  id?: string;
}

const PAGE_SIZE = 10;

export function SearchDropdown({ query, locale, dictionary, onClose, id = "search-dropdown" }: SearchDropdownProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setTopProducts(allProducts.slice(0, 5));

      // This is a simplified way to get categories.
      // In a real app, this should come from an API.
      const res = await fetch("/products.json");
      const data = await res.json();
      const allCategories: any = {};
      for (const mainCategory in data) {
        allCategories[mainCategory.toLowerCase()] = data[mainCategory]
          .flatMap((sub: any) => sub.products)
          .filter(Boolean);
        data[mainCategory].forEach((sub: any) => {
          allCategories[sub.category.toLowerCase()] = sub.products;
        });
      }
      setCategories(allCategories);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE); // Reset pagination on new query
    if (debouncedQuery) {
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      if (categories[lowerCaseQuery]) {
        setFilteredProducts(categories[lowerCaseQuery]);
      } else {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredProducts(filtered);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [debouncedQuery, products, categories]);

  // Prevent background scrolling when dropdown is open
  useEffect(() => {
    const shouldPreventScroll = query || (!query && topProducts.length > 0);
    if (shouldPreventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [query, topProducts]);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const productsToShow = query ? filteredProducts : topProducts;
  const visibleProducts = productsToShow.slice(0, visibleCount);

  return (
    <div
      id={id}
      className="absolute top-full mt-2 w-full rounded-xl border border-neutral-200/50 bg-white/90 backdrop-blur-xl shadow-xl dark:border-neutral-700/50 dark:bg-neutral-800/90 z-50 max-h-[300px] overflow-y-auto md:z-100 animate-slide-down"
      onClick={(e) => e.stopPropagation()}
    >
      {visibleProducts.length > 0 ? (
        <ul>
          {visibleProducts.map((product) => (
            <li key={product.id}>
              <Link
                href={`/${locale}/product/${product.id}`}
                className="flex items-center gap-4 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <img
                  src={product.photos[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        query && (
          <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <p>{dictionary.header?.no_products_found || "No products found."}</p>
          </div>
        )
      )}
      {productsToShow.length > visibleCount && (
        <div className="p-2 text-center">
          <button
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="w-full rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 cursor-pointer"
          >
            {dictionary.header?.show_more || "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
