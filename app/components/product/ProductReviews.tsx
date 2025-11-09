interface Comment {
  user: string;
  text: string;
  date: string;
  rating: number;
}

interface ProductReviewsProps {
  comments: Comment[];
  dictionary: any;
}

export function ProductReviews({ comments, dictionary }: ProductReviewsProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        {dictionary.product?.reviews || "Отзывы"} ({comments.length})
      </h2>
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sm:p-6 bg-white dark:bg-neutral-800"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {comment.user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{comment.user}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(comment.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < comment.rating
                        ? "text-yellow-400"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

