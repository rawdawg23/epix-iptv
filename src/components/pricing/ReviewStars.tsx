import { Star } from 'lucide-react';

interface ReviewStarsProps {
  count: string;
  rating: number;
  primaryColor?: string;
}

export default function ReviewStars({ count, rating, primaryColor = '#38bdf8' }: ReviewStarsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <span className="text-sm text-muted-foreground">+ {count} Reviews</span>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4"
            fill={i < rating ? primaryColor : 'transparent'}
            stroke={primaryColor}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </div>
  );
}
