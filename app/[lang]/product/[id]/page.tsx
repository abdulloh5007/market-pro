import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { getProductById } from "@/lib/products";
import { ProductImageGallery } from "@/app/components/ProductImageGallery";
import { ProductActions } from "@/app/components/ProductActions";
import { ProductReviews } from "@/app/components/ProductReviews";
import { ProductVariants } from "@/app/components/ProductVariants";
import Link from "next/link";

type ProductPageProps = {
  params: Promise<{
    lang?: string;
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, id } = await params;
  const locale: Locale = resolveLocale(lang);
  const dictionary = await getDictionary(locale);
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const originalPrice = product.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Хлебные крошки */}
        <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          <Link href={`/${locale}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
            {dictionary.product?.home || "Главная"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-neutral-100 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
          {/* Левая колонка - Изображения */}
          <div className="w-full">
            <ProductImageGallery images={product.photos} productName={product.name} />
          </div>

          {/* Правая колонка - Информация о товаре */}
          <div className="flex flex-col">
            {/* Название и рейтинг */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-neutral-300 dark:text-neutral-600"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  {product.rating} ({product.comments?.length || 0} {dictionary.product?.reviews || "отзывов"})
                </span>
              </div>
            </div>

            {/* Цена */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                  {product.price} {dictionary.currency}
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

            {/* Варианты товара */}
            <div className="mb-4 sm:mb-6">
              <ProductVariants product={product} dictionary={dictionary} />
            </div>

            {/* Характеристики (только для одиночных значений) */}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[80px] sm:min-w-[100px]">
                    {dictionary.product?.quantity || "В наличии"}:
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold ${product.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {product.quantity > 0 ? `${product.quantity} ${dictionary.product?.items || "шт."}` : dictionary.product?.outOfStock || "Нет в наличии"}
                  </span>
                </div>
              </div>
            )}

            {/* Описание */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {dictionary.product?.description || "Описание"}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Кнопки действий */}
            <ProductActions product={product} dictionary={dictionary} />
          </div>
        </div>

        {/* Отзывы */}
        {product.comments && product.comments.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <ProductReviews comments={product.comments} dictionary={dictionary} />
          </div>
        )}
      </div>
    </div>
  );
}

