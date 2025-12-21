import Image from "next/image";
import { type CartItem } from "@/app/context/CartContext";

interface OrderedItemCardProps {
  item: CartItem;
  dictionary: any;
}

export function OrderedItemCard({ item, dictionary }: OrderedItemCardProps) {
  const { product, quantity, selectedVariants } = item;
  const variantParts: string[] = [];
  if (selectedVariants?.memory) {
    variantParts.push(`${dictionary.product?.memory || "Память"}: ${selectedVariants.memory}`);
  }
  if (selectedVariants?.color) {
    variantParts.push(`${dictionary.product?.color || "Цвет"}: ${selectedVariants.color}`);
  }
  if (selectedVariants?.size) {
    variantParts.push(`${dictionary.product?.size || "Размер"}: ${selectedVariants.size}`);
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm bg-white dark:bg-neutral-800">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={
            product.photos && product.photos.length > 0
              ? product.photos[0]
              : "/placeholder-image.png"
          }
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {product.name}
        </p>
        {variantParts.length > 0 && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {variantParts.join(" · ")}
          </p>
        )}
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {dictionary.product?.quantity || "Количество"}: {quantity}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p
            className={`text-md font-bold ${
              product.discount
                ? "text-red-500"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {discountedPrice * quantity} {dictionary.currency}
          </p>
          {product.discount && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
              {product.price * quantity} {dictionary.currency}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
