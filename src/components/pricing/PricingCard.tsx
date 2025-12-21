import { Check, ShoppingCart } from 'lucide-react';
import PaymentBadges from './PaymentBadges';
import ReviewStars from './ReviewStars';
import { REVIEW_STATS, type PackageInfo } from './pricing-data';

interface PricingCardProps {
  package: PackageInfo;
  price: number;
  primaryColor?: string;
  ctaLink?: string;
}

export default function PricingCard({ 
  package: pkg, 
  price, 
  primaryColor = '#38bdf8',
  ctaLink = '#order'
}: PricingCardProps) {
  const isPremium = pkg.id === 'premium';
  
  return (
    <div className="relative rounded-xl border border-border/50 bg-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide">{pkg.name}</h3>
          <p className="text-xs" style={{ color: primaryColor }}>{pkg.subtitle}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-sm align-top mr-0.5">$</span>
          <span className="text-5xl font-bold">{price}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wide">
          {pkg.duration}
        </div>
      </div>

      <div className="border-t border-dashed border-border/50 my-4" />

      <ul className="space-y-3 flex-1">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check 
              className="w-4 h-4 shrink-0 mt-0.5" 
              style={{ color: primaryColor }}
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
        {pkg.bonus && (
          <li className="flex items-start gap-2 text-sm">
            <Check 
              className="w-4 h-4 shrink-0 mt-0.5" 
              style={{ color: primaryColor }}
            />
            <span style={{ color: primaryColor }} className="font-medium">{pkg.bonus}</span>
          </li>
        )}
      </ul>

      <a
        href={ctaLink}
        className="mt-6 flex items-center justify-center gap-2 w-full rounded-lg py-3 px-4 font-semibold text-sm transition-all hover:opacity-90"
        style={{ 
          backgroundColor: isPremium ? primaryColor : 'transparent',
          color: isPremium ? 'white' : 'inherit',
          border: isPremium ? 'none' : '1px solid currentColor'
        }}
      >
        <ShoppingCart className="w-4 h-4" />
        BUY NOW
      </a>

      <PaymentBadges />
      <ReviewStars 
        count={REVIEW_STATS.count} 
        rating={REVIEW_STATS.rating} 
        primaryColor={primaryColor} 
      />
    </div>
  );
}
