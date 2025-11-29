"use client";

import { useState } from "react";

interface PromoCodeCardProps {
  dictionary: any;
  onPromoCodeApplied: (code: string) => void;
  appliedPromoCode: string;
  promoMessage: string;
}

export function PromoCodeCard({
  dictionary,
  onPromoCodeApplied,
  appliedPromoCode,
  promoMessage
}: PromoCodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromoCode = () => {
    onPromoCodeApplied(promoCode);
  };

  return (
    <div className="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md p-2 transition-colors cursor-pointer"
      >
        <span className="font-medium">
          {dictionary.cart?.havePromoCode || "Есть промокод?"}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 pt-4 border-t border-[var(--color-primary)] dark:border-neutral-600">
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400 transition-all duration-200"
                  placeholder={dictionary.cart?.promoCode || "Промокод"}
                />
              </div>
              <button
                onClick={handleApplyPromoCode}
                className="w-full rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] py-3 font-semibold text-white disabled:bg-neutral-400 cursor-pointer transition-all duration-300 transform"
              >
                {dictionary.cart?.applyPromoCode || "Применить"}
              </button>
              {promoMessage && (
                <p className={`text-sm text-center ${appliedPromoCode
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                  }`}>
                  {promoMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}