export interface DevicePricing {
  starter: number;
  standard: number;
  premium: number;
}

export interface PricingTier {
  devices: number;
  label: string;
  pricing: DevicePricing;
}

export const PRICING_TIERS: PricingTier[] = [
  { devices: 1, label: '1 Device', pricing: { starter: 35, standard: 45, premium: 79 } },
  { devices: 2, label: '2 Devices', pricing: { starter: 65, standard: 79, premium: 119 } },
  { devices: 3, label: '3 Devices', pricing: { starter: 79, standard: 99, premium: 149 } },
  { devices: 4, label: '4 Devices', pricing: { starter: 85, standard: 110, premium: 199 } },
  { devices: 5, label: '5 Devices', pricing: { starter: 99, standard: 129, premium: 249 } },
];

export interface PackageInfo {
  id: 'starter' | 'standard' | 'premium';
  name: string;
  subtitle: string;
  duration: string;
  features: string[];
  bonus?: string;
}

export const PACKAGES: PackageInfo[] = [
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

export const REVIEW_STATS = {
  count: '25,567',
  rating: 5,
};
