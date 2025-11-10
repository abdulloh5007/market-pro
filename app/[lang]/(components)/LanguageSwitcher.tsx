"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

const languageLabels: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
};

function FlagIcon({ locale, className }: { locale: Locale; className?: string }) {
  switch (locale) {
    case "uz":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 1000 500"
          className={className}
        >
          <rect width="1000" height="500" fill="#0072CE" />
          <rect y="166.66" width="1000" height="166.68" fill="#FFFFFF" />
          <rect y="333.34" width="1000" height="166.66" fill="#43B02A" />
          <circle cx="200" cy="83.33" r="60" fill="#FFFFFF" />
          <circle cx="220" cy="83.33" r="60" fill="#0072CE" />
          <g fill="#FFFFFF" transform="translate(300, 83.33) scale(2.5)">
            <g id="star">
              <path d="M 0,-30 L 8.8, -10 L 28.5, -9.2 L 13.8, 4.8 L 17.6, 24.3 L 0, 14.8 L -17.6, 24.3 L -13.8, 4.8 L -28.5, -9.2 L -8.8, -10 Z" />
            </g>
            <use href="#star" transform="translate(40,0)" />
            <use href="#star" transform="translate(80,0)" />
            <use href="#star" transform="translate(120,0)" />
          </g>
        </svg>
      );
    case "ru":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 9 6"
          className={className}
        >
          <path d="m0 0h9v2H0" fill="#fff" />
          <path d="m0 2h9v2H0" fill="#0039a6" />
          <path d="m0 4h9v2H0" fill="#d52b1e" />
        </svg>
      );
    default:
      return null;
  }
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${nextLocale}`);
      setIsOpen(false);
      return;
    }

    if (!SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
      segments.unshift(DEFAULT_LOCALE);
    }

    segments[0] = nextLocale;
    router.push(`/${segments.join("/")}`);
    setIsOpen(false);
  }

  return (
    <div className="relative flex justify-end w-full md:flex md:justify-normal md:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2.5 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
        aria-label="Выбрать язык"
      >
        <FlagIcon locale={currentLocale} className="h-5 w-5 rounded-full" />
        <span className="uppercase">{currentLocale}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 min-w-[180px] rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition cursor-pointer ${
                locale === currentLocale
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <FlagIcon locale={locale} className="h-5 w-5 flex-shrink-0 rounded-full" />
              <span className="font-medium">{languageLabels[locale]}</span>
              {locale === currentLocale && (
                <svg
                  className="ml-auto h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

