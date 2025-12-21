import { useState } from 'react';
import { clsx } from 'clsx';
import { PRICING_TIERS, PACKAGES } from './pricing-data';
import PricingCard from './PricingCard';

interface DeviceTabsProps {
  primaryColor?: string;
  ctaLink?: string;
  defaultDevice?: number;
}

export default function DeviceTabs({ 
  primaryColor = '#38bdf8',
  ctaLink = '#order',
  defaultDevice = 1
}: DeviceTabsProps) {
  const [activeDevice, setActiveDevice] = useState(defaultDevice);
  
  const currentTier = PRICING_TIERS.find(t => t.devices === activeDevice) || PRICING_TIERS[0];

  return (
    <div className="w-full">
      <div className="flex justify-center mb-10">
        <div className="inline-flex flex-wrap gap-2 p-1 rounded-lg bg-muted/30">
          {PRICING_TIERS.map((tier) => (
            <button
              key={tier.devices}
              onClick={() => setActiveDevice(tier.devices)}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                activeDevice === tier.devices
                  ? "text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground border border-border/50 bg-card"
              )}
              style={activeDevice === tier.devices ? { backgroundColor: primaryColor } : undefined}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PACKAGES.map((pkg) => (
          <PricingCard
            key={pkg.id}
            package={pkg}
            price={currentTier.pricing[pkg.id]}
            primaryColor={primaryColor}
            ctaLink={ctaLink}
          />
        ))}
      </div>
    </div>
  );
}
