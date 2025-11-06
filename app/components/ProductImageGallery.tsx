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
    <div className="flex flex-col gap-4">
      {/* Основное изображение */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={displayImages[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Миниатюры */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 aspect-square w-20 sm:w-24 md:w-28 overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index
                  ? "border-purple-600 dark:border-purple-500 scale-105"
                  : "border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

