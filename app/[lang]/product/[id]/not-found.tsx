'use client';

import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale, type Locale } from "@/lib/i18n/config";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimationPlayer } from "@/app/components/common/AnimationPlayer";

export default function ProductNotFound() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Locale;
  const [dictionary, setDictionary] = useState<any>({});

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchDictionary();
  }, [lang]);

  const notFoundAnimationUrl = "/animations/notfound/notfound.tgs";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
      <div className="text-center">
        <div className="w-64 h-64 mx-auto mb-8">
          <AnimationPlayer src={notFoundAnimationUrl} loop={true} autoplay={true} />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          {dictionary.product?.notFound || "Товар не найден"}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          {dictionary.product?.notFoundDescription || "К сожалению, запрашиваемый товар не существует или был удален."}
        </p>
        <Link
          href={`/${lang}`}
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {dictionary.product?.backToHome || "Вернуться на главную"}
        </Link>
      </div>
    </div>
  );
}

