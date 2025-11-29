import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { getProductById } from "@/lib/products";
import { ProductPageContent } from "@/app/components/product/ProductPageContent";

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

  return <ProductPageContent product={product} locale={locale} dictionary={dictionary} />;
}
