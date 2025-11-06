import Link from "next/link";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram",
  },
  {
    label: "Telegram",
    href: "https://t.me",
    icon: "telegram",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: "youtube",
  },
];

function renderIcon(name: string) {
  switch (name) {
    case "instagram":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500 group-hover:text-[#E4405F]">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
        </svg>
      );
    case "telegram":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500 group-hover:text-[#229ED9]">
          <path
            d="M20.75 4.75L4.47276 11.1072C3.71931 11.4048 3.76466 12.4984 4.54444 12.724L8.8863 13.9803L10.0321 17.752C10.2509 18.477 11.2128 18.6707 11.6546 18.0525L13.5752 15.3516L17.3178 18.4303C18.0052 18.9876 19.0439 18.6304 19.2538 17.7898L21.25 9.75C21.4739 8.86348 20.5672 8.09558 19.7059 8.43021L9.5 12.3333"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500 group-hover:text-[#1877F2]">
          <path d="M13.5 10.5H15.75L15 14H13.5V21H10.5V14H8.5V10.5H10.5V9C10.5 7.01472 12.0147 5.5 14 5.5H15.5V9H14C13.7239 9 13.5 9.22386 13.5 9.5V10.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:text-[#FF0000] text-neutral-500">
          <path
            d="M21.5 9.5C21.5 8.39543 20.6046 7.5 19.5 7.5C17.4087 7.5 14.1224 7.5 12 7.5C9.87765 7.5 6.59134 7.5 4.5 7.5C3.39543 7.5 2.5 8.39543 2.5 9.5V14.5C2.5 15.6046 3.39543 16.5 4.5 16.5C6.59134 16.5 9.87765 16.5 12 16.5C14.1224 16.5 17.4087 16.5 19.5 16.5C20.6046 16.5 21.5 15.6046 21.5 14.5V9.5Z"
            fill="currentColor"
          />
          <path d="M10.5 10.5L14.5 12L10.5 13.5V10.5Z" fill="white" />
        </svg>
      );
    default:
      return null;
  }
}

// @ts-ignore
export function Footer({ dictionary }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-neutral-100 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 text-2xl text-neutral-500 transition-all duration-300 hover:bg-neutral-300/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50"
                aria-label={social.label}
              >
                {renderIcon(social.icon)}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link href="#privacy" className="transition hover:text-purple-600 hover:underline dark:hover:text-purple-400">
              {dictionary.footer.privacy_policy}
            </Link>
            <Link href="#terms" className="transition hover:text-purple-600 hover:underline dark:hover:text-purple-400">
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