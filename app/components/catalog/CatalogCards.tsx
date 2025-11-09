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
        group relative flex flex-col lg:flex-row lg:aspect-auto lg:h-[60px]
        items-center justify-center lg:justify-between
        rounded-xl md:p-4 ${bgColor} 
        shadow-md transition-transform duration-300
        hover:scale-[1.03] hover:shadow-lg
        relative z-10 hover:z-50
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
    <section className="mx-auto w-full max-w-6xl px-4 py-2 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CatalogCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}
