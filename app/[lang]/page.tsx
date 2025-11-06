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
    <div className="bg-white dark:bg-neutral-900">
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 md:px-6">
        <HeroCarousel />
      </section>

      <CatalogCards dictionary={dictionary} />

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <TopProducts lang={locale} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {dictionary.welcome}
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">{dictionary.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: dictionary.features.installment.title,
              description: dictionary.features.installment.description,
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: dictionary.features.support.title,
              description: dictionary.features.support.description,
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              title: dictionary.features.returns.title,
              description: dictionary.features.returns.description,
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-purple-200 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-purple-700"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-900/30 dark:text-purple-400 dark:group-hover:bg-purple-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

