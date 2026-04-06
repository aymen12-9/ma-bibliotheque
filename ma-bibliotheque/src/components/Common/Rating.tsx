import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export const Rating: React.FC<RatingProps> = ({ value, onChange, readonly = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};