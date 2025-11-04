import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type LangLayoutProps = {
  children: ReactNode;
  params: Promise<{
    lang?: string;
  }>;
};

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dictionary = await getDictionary(locale);

  if (lang && lang !== locale) {
    redirect(`/${locale}`);
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-black">
        <Header locale={locale} dictionary={dictionary} />
        <main className="flex-1 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.04)] dark:bg-neutral-900 dark:shadow-[0_6px_24px_rgba(0,0,0,0.3)]">
          {children}
        </main>
        <Footer dictionary={dictionary} />
      </div>
    </ThemeProvider>
  );
}

