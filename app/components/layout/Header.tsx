"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useCart } from "@/app/context/CartContext";
import { LanguageSwitcher } from "../../[lang]/(components)/LanguageSwitcher";
import { ThemeSwitcher } from "../../[lang]/(components)/ThemeSwitcher";
import { SearchDropdown } from "./SearchDropdown";

// @ts-ignore
const navActions = (dictionary: any, locale: Locale, cartItemCount: number) => [
  {
    label: "Ergashev",
    description: dictionary.profile,
    href: `/${locale}/profile`,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: dictionary.favorites,
    description: dictionary.no_items,
    href: `/${locale}/favorites`,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 18L10.9384 17.0503C6.8 13.4 4 11 4 8C4 5.6 5.6 4 8 4C9.4 4 10.8 4.6 12 5.8C13.2 4.6 14.6 4 16 4C18.4 4 20 5.6 20 8C20 11 17.2 13.4 13.0616 17.0503L12 18Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: dictionary.cart,
    description: cartItemCount === 0 ? dictionary.no_items : `${cartItemCount} ${dictionary.one_item}`,
    href: "#cart",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 6H5.87938C6.30792 6 6.67612 6.30306 6.76349 6.72324L8.5 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M8.5 15H17.6976C18.2017 15 18.6299 14.6318 18.698 14.1326L19.5 8.5H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="10" cy="18.5" r="1.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.5" cy="18.5" r="1.3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

type HeaderProps = {
  locale: Locale;
  // @ts-ignore
  dictionary: any;
};

export function Header({ locale, dictionary }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  const { cartItems } = useCart();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  const actions = navActions(dictionary.header, locale, cartItems.length);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoritesCount(storedFavorites.length);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSearchFocused && isMobile) { // Apply only on mobile when search is focused
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Clean up on unmount
    };
  }, [isSearchFocused, isMobile]);

  // обновляем описание для избранного
  const favoritesAction = actions.find(a => a.label === dictionary.header.favorites);
  if (favoritesAction) {
    favoritesAction.href = `/${locale}/favorites`;
    favoritesAction.description = favoritesCount === 0
      ? dictionary.header.no_items
      : `${favoritesCount} ${dictionary.header.one_item}`;
  }

  const cartAction = actions.find(action => action.label === dictionary.header.cart);
  if (cartAction) {
    cartAction.href = `/${locale}/cart`;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href={`/${locale}`}
          className="flex flex-shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-[#5e28d1] dark:text-[#8b5cf6]"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 text-base font-bold text-[#5e28d1] shadow">
            M
          </span>
          <span className="text-xl font-bold">market</span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center px-8">
          <form
            ref={searchContainerRef}
            className="relative w-full max-w-lg"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={dictionary.header.search_placeholder}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-4 pr-12 text-sm text-neutral-700 shadow-sm focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
              aria-label={dictionary.header.search_button}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M16.5 16.5L20 20"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {isSearchFocused && <SearchDropdown query={query} locale={locale} dictionary={dictionary} />}
          </form>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-5">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 text-sm text-neutral-600 transition hover:text-[#5e28d1] dark:text-neutral-300 dark:hover:text-[#8b5cf6]"
              >
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {action.icon}

                  {action.label === dictionary.header.cart && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8b5cf6] text-[11px] font-bold text-white border-2 border-white dark:border-neutral-900">
                      {cartItems.length}
                    </span>
                  )}
                </span>

                <span className="hidden lg:flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200">
                    {action.label}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {action.label === dictionary.header.cart
                      ? `${cartItems.length} ${dictionary.header.no_items}`
                      : action.description}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 md:block"></div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            {/* <ThemeSwitcher /> */}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400 md:hidden"
            aria-label={dictionary.header.menu}
          >
            {isMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800">
          <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
            <form
              className="relative mb-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dictionary.header.search_placeholder}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-4 pr-12 text-sm text-neutral-700 shadow-sm focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                aria-label={dictionary.header.search_button}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M16.5 16.5L20 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>

            <nav className="flex flex-col gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.label === dictionary.header.cart && cartItems.length > 0 && (
                    <span className="ml-auto inline-flex h-6 items-center rounded-full bg-[#5e28d1] px-2.5 text-xs font-semibold text-white dark:bg-[#8b5cf6]">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center justify-between">
              <LanguageSwitcher currentLocale={locale} />
              {/* <ThemeSwitcher /> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}