export const SUPPORTED_LOCALES = ["uz", "ru"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz";

export function resolveLocale(rawLocale?: string): Locale {
  if (!rawLocale) {
    return DEFAULT_LOCALE;
  }

  return (SUPPORTED_LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;
}

