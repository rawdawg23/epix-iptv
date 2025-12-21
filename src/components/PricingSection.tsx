import { useState } from 'react';
import { Check, ShoppingCart, Star, Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface DevicePricing {
  starter: number;
  standard: number;
  premium: number;
}

interface PricingTier {
  devices: number;
  label: string;
  pricing: DevicePricing;
}

const PRICING_TIERS: PricingTier[] = [
  { devices: 1, label: '1 Device', pricing: { starter: 35, standard: 45, premium: 79 } },
  { devices: 2, label: '2 Devices', pricing: { starter: 65, standard: 79, premium: 119 } },
  { devices: 3, label: '3 Devices', pricing: { starter: 79, standard: 99, premium: 149 } },
  { devices: 4, label: '4 Devices', pricing: { starter: 85, standard: 110, premium: 199 } },
  { devices: 5, label: '5 Devices', pricing: { starter: 99, standard: 129, premium: 249 } },
];

interface PackageInfo {
  id: 'starter' | 'standard' | 'premium';
  name: string;
  subtitle: string;
  duration: string;
  features: string[];
  bonus?: string;
}

const PACKAGES: PackageInfo[] = [
  {
    id: 'starter',
    name: 'STARTER PACKAGE',
    subtitle: 'No Binding Contract',
    duration: '/3 MONTHS',
    features: [
      '+55,000 Global Live Channels',
      '+90,000 Movies And Series',
      'Time-Shift & EPG Guide',
      'Quality SD, HD, FHD et 4K',
      'Anti-Freeze Technology™',
      'Daily Updates',
      '30-Day Money-Back Guarantee',
    ],
  },
  {
    id: 'standard',
    name: 'STANDARD PACKAGE',
    subtitle: 'No Binding Contract',
    duration: '/6 MONTHS',
    features: [
      '+55,000 Global Live Channels',
      '+90,000 Movies And Series',
      'Time-Shift & EPG Guide',
      'Quality SD, HD, FHD et 4K',
      'Anti-Freeze Technology™',
      'Daily Updates',
      '30-Day Money-Back Guarantee',
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM PACKAGE',
    subtitle: 'No Binding Contract',
    duration: '/12 MONTHS + 3 BONUS',
    features: [
      '+55,000 Global Live Channels',
      '+90,000 Movies And Series',
      'Time-Shift & EPG Guide',
      'Quality SD, HD, FHD et 4K',
      'Anti-Freeze Technology™',
      'Daily Updates',
      '30-Day Money-Back Guarantee',
    ],
    bonus: '+ 3 months free',
  },
];

const REVIEW_STATS = {
  count: '25,567',
  rating: 5,
};

function PaymentBadges() {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
        <Shield className="w-3 h-3" />
        <span>Guaranteed Safe & Secure Checkout</span>
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 bg-muted/50 rounded font-medium">McAfee SECURE</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#1a1f71] text-white rounded font-bold">VISA</span>
        <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-[#eb001b] to-[#f79e1b] text-white rounded font-bold">MC</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#006fcf] text-white rounded font-bold">AMEX</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#003087] text-white rounded font-bold">PayPal</span>
      </div>
    </div>
  );
}

function ReviewStars({ primaryColor = '#38bdf8' }: { primaryColor?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <span className="text-sm text-muted-foreground">+ {REVIEW_STATS.count} Reviews</span>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4"
            fill={i < REVIEW_STATS.rating ? primaryColor : 'transparent'}
            stroke={primaryColor}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </div>
  );
}

interface PricingCardProps {
  pkg: PackageInfo;
  price: number;
  primaryColor?: string;
  ctaLink?: string;
  buttonText?: string;
}

function PricingCard({ pkg, price, primaryColor = '#38bdf8', ctaLink = '#order', buttonText = 'BUY NOW' }: PricingCardProps) {
  const isPremium = pkg.id === 'premium';
  
  return (
    <div className="relative rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-6 flex flex-col h-full">
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

      <div className="border-t border-dashed border-white/20 my-4" />

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
        target={ctaLink.startsWith('http') ? '_blank' : undefined}
        rel={ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="mt-6 flex items-center justify-center gap-2 w-full rounded-lg py-3 px-4 font-semibold text-sm transition-all hover:opacity-90"
        style={{ 
          backgroundColor: isPremium ? primaryColor : 'transparent',
          color: isPremium ? 'white' : 'inherit',
          border: isPremium ? 'none' : '1px solid rgba(255,255,255,0.3)'
        }}
      >
        <ShoppingCart className="w-4 h-4" />
        {buttonText}
      </a>

      <PaymentBadges />
      <ReviewStars primaryColor={primaryColor} />
    </div>
  );
}

type PaymentType = 'paygate' | 'whatsapp' | 'email' | 'custom_link';

interface ContactInfo {
  whatsappNumber?: string;
  telegramUsername?: string;
  supportEmail?: string;
}

interface PaymentSettings {
  paymentType: PaymentType;
  paygateWalletAddress?: string;
  paygateSuccessUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  contactEmail?: string;
  emailSubject?: string;
  customPaymentLink?: string;
  buttonText?: string;
  contactInfo?: ContactInfo;
}

interface PricingSectionProps {
  primaryColor?: string;
  ctaLink?: string;
  defaultDevice?: number;
  showHeader?: boolean;
  plans?: unknown[];
  paymentSettings?: PaymentSettings;
  brandName?: string;
  baseUrl?: string;
}

function generatePaymentLink(
  paymentSettings: PaymentSettings | undefined,
  packageName: string,
  price: number,
  brandName: string,
  baseUrl?: string
): string {
  if (!paymentSettings) return '#order';
  
  const { paymentType } = paymentSettings;
  
  switch (paymentType) {
    case 'paygate': {
      const wallet = paymentSettings.paygateWalletAddress || '';
      if (!wallet) return '#order';
      const encodedProduct = encodeURIComponent(`${brandName} - ${packageName}`);
      const successUrl = paymentSettings.paygateSuccessUrl || (baseUrl ? `${baseUrl}/thank-you` : '/thank-you');
      const encodedSuccessUrl = encodeURIComponent(successUrl);
      return `https://paygate.to/pay/?currency=USDC&amount=${price}&wallet=${wallet}&product=${encodedProduct}&success_url=${encodedSuccessUrl}`;
    }
    case 'whatsapp': {
      const number = (paymentSettings.whatsappNumber || '').replace(/\D/g, '');
      const message = paymentSettings.whatsappMessage || `Hi, I want to order ${packageName} ($${price})`;
      const encodedMsg = encodeURIComponent(message.replace('{package}', packageName).replace('{price}', `$${price}`));
      return `https://wa.me/${number}?text=${encodedMsg}`;
    }
    case 'email': {
      const email = paymentSettings.contactEmail || '';
      const subject = paymentSettings.emailSubject || `Order: ${packageName}`;
      const body = `Hi, I want to order ${packageName} for $${price}.\n\nPlease send me the payment details.`;
      return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    case 'custom_link': {
      return paymentSettings.customPaymentLink || '#order';
    }
    default:
      return '#order';
  }
}

export default function PricingSection({ 
  primaryColor = '#38bdf8',
  ctaLink,
  defaultDevice = 1,
  showHeader = true,
  paymentSettings,
  brandName = 'IPTV Service',
  baseUrl,
}: PricingSectionProps) {
  const [activeDevice, setActiveDevice] = useState(defaultDevice);
  
  const currentTier = PRICING_TIERS.find(t => t.devices === activeDevice) || PRICING_TIERS[0];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options designed to fit your entertainment needs. All plans include full access to our premium features.
            </p>
          </div>
        )}

        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1 rounded-lg bg-muted/20">
            {PRICING_TIERS.map((tier) => (
              <button
                key={tier.devices}
                onClick={() => setActiveDevice(tier.devices)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  activeDevice === tier.devices
                    ? "text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground border border-white/20 bg-card/50"
                )}
                style={activeDevice === tier.devices ? { backgroundColor: primaryColor } : undefined}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PACKAGES.map((pkg) => {
            const price = currentTier.pricing[pkg.id];
            const link = paymentSettings 
              ? generatePaymentLink(paymentSettings, pkg.name, price, brandName, baseUrl)
              : (ctaLink || '#order');
            return (
              <PricingCard
                key={pkg.id}
                pkg={pkg}
                price={price}
                primaryColor={primaryColor}
                ctaLink={link}
                buttonText={paymentSettings?.buttonText || 'BUY NOW'}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
