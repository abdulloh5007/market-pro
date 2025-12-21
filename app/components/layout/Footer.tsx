"use client"

import Link from "next/link";
import { TgsPlayer } from "../common/TgsPlayer";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "/animations/footer/instagram.tgs",
  },
  {
    label: "Telegram",
    href: "https://t.me",
    icon: "/animations/footer/telegram.tgs",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "/animations/footer/facebook.tgs",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: "/animations/footer/youtube.tgs",
  },
];

// @ts-ignore
export function Footer({ dictionary }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-neutral-100 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                <TgsPlayer src={social.icon} />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link href="#privacy" className="transition hover:text-[color:var(--color-primary-text)] hover:underline">
              {dictionary.footer.privacy_policy}
            </Link>
            <Link href="#terms" className="transition hover:text-[color:var(--color-primary-text)] hover:underline">
              {dictionary.footer.terms_of_use}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 sm:text-xs">
            {dictionary.footer.copyright.replace("{currentYear}", currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}