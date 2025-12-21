"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/i18n/config";
import { type Product, calculatePrice } from "@/lib/products";
import {
    ProductImageGallery,
    ProductActions,
    ProductReviews,
    ProductVariants,
} from "@/app/components/product";
import Link from "next/link";

type ProductPageContentProps = {
    product: Product;
    locale: Locale;
    dictionary: any;
};

export function ProductPageContent({ product, locale, dictionary }: ProductPageContentProps) {
    const [selectedVariants, setSelectedVariants] = useState<{
        memory?: string;
        color?: string;
        size?: string;
    }>({
        memory: Array.isArray(product.memory) ? product.memory[0] : product.memory,
        color: Array.isArray(product.color) ? product.color[0] : product.color,
        size: product.size && product.size.length > 0 ? product.size[0] : undefined,
    });

    const currentPrice = calculatePrice(product, selectedVariants);
    const originalPrice = product.discount && typeof product.discount === "number" && product.discount > 0 && currentPrice > 0
        ? Math.round(currentPrice / (1 - product.discount / 100))
        : null;

    const handleVariantChange = (variants: { memory?: string; color?: string; size?: string }) => {
        setSelectedVariants(variants);
    };

    // Calculate average rating
    let averageRating = 0;
    if (Array.isArray(product.comments) && product.comments.length > 0) {
        const sum = product.comments.reduce((acc, c) => {
            const r = typeof c.rating === "number" ? c.rating : Number(c.rating) || 0;
            return acc + r;
        }, 0);
        averageRating = sum / product.comments.length;
    } else if (typeof product.rating === "number") {
        averageRating = product.rating;
    }

    const averageRatingDisplay = Number.isFinite(averageRating) ? averageRating.toFixed(1) : "0.0";

    // Normalize comments
    const normalizedComments = Array.isArray(product.comments)
        ? product.comments.map((c) => ({
            user: c.user ?? "Anonymous",
            text: c.text ?? "",
            date: c.date ?? new Date().toISOString(),
            rating: typeof c.rating === "number" ? c.rating : 0,
        }))
        : [];

    return (
        <div className="bg-white dark:bg-neutral-900 min-h-screen overflow-hidden">
            <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                {/* Breadcrumbs */}
                <nav className="flex mb-4 sm:mb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <Link
                        href={`/${locale}`}
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                        {dictionary.product?.home || "Главная"}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-900 dark:text-neutral-100 line-clamp-1">{product.name}</span>
                </nav>

                <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
                    {/* Left column - Images */}
                    <div className="w-full lg:sticky lg:top-24 lg:self-start">
                        <ProductImageGallery images={product.photos ?? []} productName={product.name ?? ""} />
                    </div>

                    {/* Right column - Product Info */}
                    <div className="flex flex-col">
                        {/* Title and rating */}
                        <div className="mb-3 sm:mb-4">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-neutral-300 dark:text-neutral-600"
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                                    {averageRatingDisplay} ({product.comments?.length ?? 0} {dictionary.product?.reviews || "отзывов"})
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4 sm:mb-2">
                            <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {currentPrice} {dictionary.currency}
                                </span>
                                {product.discount && (
                                    <span className="text-base sm:text-lg md:text-xl text-red-600 dark:text-red-400 font-semibold">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>
                            {originalPrice && (
                                <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 line-through">
                                    {originalPrice} {dictionary.currency}
                                </p>
                            )}
                        </div>

                        {/* Product variants */}
                        <div className="mb-4 sm:mb-6">
                            <ProductVariants
                                product={product}
                                dictionary={dictionary}
                                onVariantChange={handleVariantChange}
                            />
                        </div>

                        {/* Stock */}
                        <div className="mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[80px] sm:min-w-[100px]">
                                    {dictionary.product?.quantity || "В наличии"}:
                                </span>
                                <span
                                    className={`text-xs sm:text-sm font-semibold ${product.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {product.quantity > 0
                                        ? `${product.quantity} ${dictionary.product?.items || "шт."}`
                                        : dictionary.product?.outOfStock || "Нет в наличии"}
                                </span>
                            </div>
                        </div>

                        {/* Characteristics (only for single values) */}
                        {product.model && !Array.isArray(product.memory) && !Array.isArray(product.color) && (
                            <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                                {product.model && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[80px] sm:min-w-[100px]">
                                            {dictionary.product?.model || "Модель"}:
                                        </span>
                                        <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{product.model}</span>
                                    </div>
                                )}
                                {product.memory && typeof product.memory === "string" && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[80px] sm:min-w-[100px]">
                                            {dictionary.product?.memory || "Память"}:
                                        </span>
                                        <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{product.memory}</span>
                                    </div>
                                )}
                                {product.color && typeof product.color === "string" && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[80px] sm:min-w-[100px]">
                                            {dictionary.product?.color || "Цвет"}:
                                        </span>
                                        <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{product.color}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                {dictionary.product?.description || "Описание"}
                            </h2>
                            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <ProductActions
                            product={product}
                            dictionary={dictionary}
                            selectedVariants={selectedVariants}
                            currentPrice={currentPrice}
                            showStock={false}
                        />
                    </div>
                </div>

                {/* Reviews */}
                {normalizedComments.length > 0 && (
                    <div className="mt-8 sm:mt-12">
                        <ProductReviews comments={normalizedComments} dictionary={dictionary} />
                    </div>
                )}

            </div>
        </div>
    );
}
