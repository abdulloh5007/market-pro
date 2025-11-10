"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface CatalogCardProps {
  title: string;
  imageUrl: string;
  bgColor: string;
  catalogKey: string;
  isActive: boolean;
  onClick: (catalog: string) => void;
}

const CatalogCard: React.FC<CatalogCardProps> = ({
  title,
  imageUrl,
  bgColor,
  catalogKey,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(catalogKey)}
      className={`
    group relative flex flex-col lg:flex-row lg:aspect-auto lg:h-[60px]
    items-center justify-center lg:justify-between
    rounded-xl md:p-4 ${bgColor} 
    shadow-md transition-all duration-300
    hover:scale-[1.03] hover:shadow-lg
    relative z-10 hover:z-50
    ${isActive ? 'active-glow scale-[1.02]' : ''}
    cursor-pointer 
  `}
    >
      {/* Картинка */}
      <div
        className={`
          relative lg:absolute
          w-20 h-20
          lg:right-0 lg:top-1/2 lg:-translate-y-1/2 
          lg:translate-x-[10%] xl:translate-x-1/4 
          rotate-12 opacity-70
          transition-all duration-500
          group-hover:opacity-90 group-hover:rotate-6 group-hover:scale-110
          z-20
        `}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>

      {/* Заголовок */}
      <span className="text-sm sm:text-base lg:text-lg font-semibold text-white z-10 mt-auto lg:mt-0">
        {title}
      </span>
    </button>
  );
};

// Client component for catalog cards interaction
function CatalogCardsClient({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCatalog = searchParams.get("catalog");

  const handleCatalogClick = (catalog: string) => {
    const currentPath = window.location.pathname;
    if (catalog === currentCatalog) {
      // If same catalog is clicked, remove the parameter
      router.push(currentPath);
    } else {
      // If different catalog is clicked, update the parameter
      const newUrl = `${currentPath}?catalog=${catalog}`;
      router.push(newUrl);
    }
  };

  const categories = [
    {
      title: dictionary.categories.electronics,
      imageUrl: "/catalog-card-photos/joy.png",
      bgColor: "bg-blue-500",
      catalogKey: "electronics",
    },
    {
      title: dictionary.categories.clothes,
      imageUrl: "/catalog-card-photos/clothes.png",
      bgColor: "bg-pink-500",
      catalogKey: "clothes",
    },
    {
      title: dictionary.categories.sport,
      imageUrl: "/catalog-card-photos/sports.png",
      bgColor: "bg-green-500",
      catalogKey: "sport",
    },
    {
      title: dictionary.categories.books,
      imageUrl: "/catalog-card-photos/books.png",
      bgColor: "bg-yellow-500",
      catalogKey: "books",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-2 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CatalogCard
            key={category.catalogKey}
            {...category}
            isActive={currentCatalog === category.catalogKey}
            onClick={handleCatalogClick}
          />
        ))}
      </div>
    </section>
  );
}

export function CatalogCards({ dictionary }: { dictionary: any }) {
  return <CatalogCardsClient dictionary={dictionary} />;
}
