import { Star, ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  slug: string;
  rating: number;
  channelCount: number;
  price: string;
  description: string;
  featured?: boolean;
  primaryColor?: string;
}

export default function ServiceCard({
  name,
  slug,
  rating,
  channelCount,
  price,
  description,
  featured = false,
  primaryColor = '#3b82f6',
}: ServiceCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-muted-foreground" />
        );
      }
    }
    return stars;
  };

  return (
    <article className={`relative bg-card rounded-2xl border border-border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${
      featured ? 'ring-2 ring-primary' : ''
    }`}>
      {featured && (
        <div 
          className="absolute -top-3 left-4 px-3 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: primaryColor }}
        >
          Editor's Choice
        </div>
      )}
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">
            <a href={`/iptv/${slug}`} className="hover:text-primary transition-colors">
              {name}
            </a>
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              ({rating.toFixed(1)})
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: primaryColor }}>
            {price}
          </div>
          <div className="text-xs text-muted-foreground">/month</div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm">
          <span className="font-semibold">{channelCount.toLocaleString()}+</span>
          <span className="text-muted-foreground ml-1">channels</span>
        </div>
        
        <a
          href={`/iptv/${slug}`}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: primaryColor, color: 'white' }}
        >
          View Details
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
