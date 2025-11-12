"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Если нет изображений, используем заглушку
  const displayImages = images.length > 0 ? images : ["/catalog-card-photos/technics.png"];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Основное изображение */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-md">
        <Image
          src={displayImages[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-contain p-3 sm:p-4 transition-opacity duration-300"
          priority
          onError={(e) => {
            // Если изображение не загружается, используем заглушку
            const target = e.target as HTMLImageElement;
            target.src = "/catalog-card-photos/technics.png";
          }}
        />
      </div>

      {/* Миниатюры */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 pb-2 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 aspect-square w-16 sm:w-20 md:w-24 lg:w-28 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                selectedImage === index
                  ? "border-[var(--color-primary)] dark:[var(--color-primary)] scale-105 shadow-md"
                  : "border-neutral-200 dark:border-neutral-700 dark:hover:border-[var(--color-primary-hover)] hover:scale-105"
              }`}
              type="button"
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain p-1.5 sm:p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/catalog-card-photos/technics.png";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

