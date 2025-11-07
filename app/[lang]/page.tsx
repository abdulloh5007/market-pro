import { SUPPORTED_LOCALES, resolveLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { HeroCarousel } from "./(components)/HeroCarousel";
import { CatalogCards } from "@/app/components/CatalogCards";
import TopProducts from "../components/TopProducts";

type PageProps = {
  params: Promise<{
    lang?: string;
  }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function LangHomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = resolveLocale(lang);
  const dictionary = await getDictionary(locale);

  return (
    <div className="bg-white dark:bg-neutral-900 overflow-hidden">
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 md:px-6">
        <HeroCarousel />
      </section>

      <CatalogCards dictionary={dictionary} />

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <TopProducts lang={locale} />
      </section>
    </div>
  );
}

