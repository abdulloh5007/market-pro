"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCategoriesByCatalog, CatalogType } from "@/lib/products";

const getCategoryLabel = (category: string) => {
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // ✅ Проверка видимости теней
  const updateShadows = () => {
    const el = scrollRef.current;
    if (!el) return;

    const canScroll = el.scrollWidth > el.clientWidth;

    if (!canScroll) {
      setShowLeftShadow(false);
      setShowRightShadow(false);
      return;
    }

    setShowLeftShadow(el.scrollLeft > 0);
    setShowRightShadow(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateShadows();
    window.addEventListener("resize", updateShadows);
    return () => window.removeEventListener("resize", updateShadows);
  }, [categories]);

  const handleScroll = () => {
    updateShadows();
  };

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
    
    // Используем router.replace для обновления URL без перезагрузки страницы
    router.replace(newUrl, { scroll: false });
  };

  if (!catalog || categories.length === 0) return null;

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-800 rounded-full h-10 w-24 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <div className="relative">
        {/* Scrollable buttons */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto py-6 md:py-4 scrollbar-hide"
        >
          {categories.map((category) => {
            const isActive = categoryParam === category.key;
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryClick(category.key)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white' 
                    : 'text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* ✅ Left shadow */}
        {showLeftShadow && (
          <div className="pointer-events-none absolute top-0 left-0 h-full w-8 rounded-full bg-gradient-to-r from-black/40 to-transparent" />
        )}

        {/* ✅ Right shadow */}
        {showRightShadow && (
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 rounded-full bg-gradient-to-l from-black/40 to-transparent" />
        )}
      </div>
    </section>
  );
}
