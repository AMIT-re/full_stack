import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 5,
  totalReviews = null,
  interactive = false,
  onChange = null,
  size = 'w-4 h-4',
  showScore = true
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = displayRating >= star;
          const half = !filled && displayRating >= star - 0.5;

          return (
            <button
              type="button"
              key={star}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none p-0.5`}
            >
              <Star
                className={`${size} ${
                  filled
                    ? 'text-amber-400 fill-amber-400'
                    : half
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showScore && !interactive && (
        <span className="text-xs font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}

      {totalReviews !== null && !interactive && (
        <span className="text-xs text-gray-500">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
