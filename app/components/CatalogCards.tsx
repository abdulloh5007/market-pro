import Link from "next/link";
import Image from "next/image";
import React from "react";

interface CatalogCardProps {
  title: string;
  imageUrl: string;
  bgColor: string;
  href: string;
}

const CatalogCard: React.FC<CatalogCardProps> = ({
  title,
  imageUrl,
  bgColor,
  href,
}) => {
  return (
    <Link
      href={href}
      className={`
        group relative flex h-[60px] flex-1 items-center justify-between 
        rounded-xl p-4 ${bgColor} 
        shadow-md transition-transform duration-300 
        hover:scale-[1.03] hover:shadow-lg
      `}
    >
      {/* Заголовок */}
      <span className="text-lg font-semibold text-white z-10">
        {title}
      </span>

      {/* Картинка */}
      <div
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 
          translate-x-1/6 sm:translate-x-[10%] md:translate-x-1/4 
          rotate-12 opacity-70 w-20 h-20
          transition-all duration-500
          group-hover:opacity-90 group-hover:rotate-6 group-hover:scale-110
        `}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    </Link>
  );
};

export function CatalogCards({ dictionary }: { dictionary: any }) {
  const categories = [
    {
      title: dictionary.categories.electronics,
      imageUrl: "/catalog-card-photos/joy.png",
      bgColor: "bg-blue-500",
      href: "#electronics",
    },
    {
      title: dictionary.categories.clothes,
      imageUrl: "/catalog-card-photos/clothes.png",
      bgColor: "bg-pink-500",
      href: "#clothes",
    },
    {
      title: dictionary.categories.sport,
      imageUrl: "/catalog-card-photos/sports.png",
      bgColor: "bg-green-500",
      href: "#sport",
    },
    {
      title: dictionary.categories.books,
      imageUrl: "/catalog-card-photos/books.png",
      bgColor: "bg-yellow-500",
      href: "#books",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-2 md:px-6 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <CatalogCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}
