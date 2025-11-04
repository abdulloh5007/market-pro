import type { Locale } from "./config";

import ru from "@/public/locales/ru.json";
import uz from "@/public/locales/uz.json";

const dictionaries: Record<Locale, typeof uz> = {
  uz,
  ru,
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

