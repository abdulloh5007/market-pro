"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCategoriesByCatalog, CatalogType } from "@/lib/products";

const getCategoryLabel = (category: string) => {
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

interface CategoryButton {
  key: string;
  label: string;
}

export default function CategoryFilters({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryButton[]>([]);
  const [loading, setLoading] = useState(false);

  const catalogParam = searchParams.get("catalog");
  const categoryParam = searchParams.get("category") || "all";
  const catalog = catalogParam as CatalogType | null;

  useEffect(() => {
    const fetchCategories = async () => {
      if (catalog) {
        setLoading(true);
        try {
          const categoryData = await getCategoriesByCatalog(catalog);
          const categoryButtons: CategoryButton[] = [
            { key: "all", label: dictionary.categories.all || "Все" },
            ...categoryData.map((cat) => ({
              key: cat.category,
              label: getCategoryLabel(cat.category),
            })),
          ];
          setCategories(categoryButtons);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setCategories([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [catalog, dictionary]);

  const handleCategoryClick = (category: string) => {
    const currentPath = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    
    const newUrl = params.toString() 
      ? `${currentPath}?${params.toString()}`
      : currentPath;
    
    router.push(newUrl);
  };

  if (!catalog || categories.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 md:px-6">
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-800 rounded-lg h-10 w-24 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-4 md:px-6">
      <div className="flex gap-2 overflow-x-auto py-2">
        {categories.map((category) => {
          const isActive = categoryParam === category.key;
          return (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-purple-50 text-purple-600 shadow-sm hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}