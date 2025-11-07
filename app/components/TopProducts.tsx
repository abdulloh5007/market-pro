
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Locale } from "@/lib/i18n/config";
import { ProductCard } from "./ProductCard";
import { getAllProducts } from "@/lib/products";

const fallbackImages = [
  "/catalog-card-photos/books.png",
  "/catalog-card-photos/clothes.png",
  "/catalog-card-photos/joy.png",
  "/catalog-card-photos/joystick.png",
  "/catalog-card-photos/sports.png",
  "/catalog-card-photos/technics.png",
];

const getProductImage = (product: { photos?: string[] }) => {
  // Используем первое изображение из photos, если оно есть
  if (product.photos && product.photos.length > 0) {
    return product.photos[0];
  }
  // Иначе используем случайную заглушку
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

export default async function TopProducts({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const products = await getAllProducts();
  const topRatedProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 10);

  return (
    <div className="py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-2 sm:px-0">{dictionary.topRatedProducts}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 px-2 sm:px-0">
        {topRatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            imageUrl={getProductImage(product)}
            dictionary={dictionary}
          />
        ))}
      </div>
    </div>
  );
}
