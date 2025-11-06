import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, maxStars = 5, size = 'w-4 h-4', showNumber = false, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)}/{maxStars})
        </span>
      )}
    </div>
  );
};

export default StarRating;
