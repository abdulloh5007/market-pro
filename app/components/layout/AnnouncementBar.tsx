"use client";

type AnnouncementBarProps = {
  // @ts-ignore
  dictionary: any;
};

export function AnnouncementBar({ dictionary }: AnnouncementBarProps) {
  return (
    <div className="relative dark:border-neutral-800 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 py-2">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#5e28d1]"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="flex">
            <span className="bg-[#5e28d1] text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
              -50%
            </span>
            {/* <span className="mx-1">•</span> */}
            <p className="text-neutral-700 dark:text-neutral-300 font-bold">Используй промокод <span className="text-[#5e28d1] font-bold">MARKET</span></p>
          </span>
        </div>
      </div>
    </div>
  );
}