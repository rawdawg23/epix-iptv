import { REQUIRED_SECTIONS, type RequiredSection } from './registry';

export interface SectionDefinition {
  id: RequiredSection;
  component: string;
  order: number;
  required: boolean;
  description: string;
  requiredProps: string[];
  dataSource: 'serviceInfo' | 'collection' | 'static';
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    id: 'hero',
    component: 'HeroSection',
    order: 0,
    required: true,
    description: 'Main hero banner with brand messaging and stats',
    requiredProps: ['title', 'subtitle', 'channelCount', 'vodCount', 'primaryColor'],
    dataSource: 'serviceInfo'
  },
  {
    id: 'films-series',
    component: 'FilmsSeriesSection',
    order: 1,
    required: true,
    description: 'Showcase of movie and TV series library',
    requiredProps: ['brandName', 'primaryColor'],
    dataSource: 'serviceInfo'
  },
  {
    id: 'sports',
    component: 'SportsSection',
    order: 2,
    required: true,
    description: 'Live sports channels and events showcase',
    requiredProps: ['brandName', 'primaryColor'],
    dataSource: 'serviceInfo'
  },
  {
    id: 'money-back-guarantee',
    component: 'GuaranteeSection',
    order: 3,
    required: true,
    description: 'Trust-building 100% money back guarantee section',
    requiredProps: ['brandName', 'primaryColor'],
    dataSource: 'serviceInfo'
  },
  {
    id: 'how-to-purchase',
    component: 'HowToPurchaseSection',
    order: 4,
    required: true,
    description: 'Step-by-step purchase instructions',
    requiredProps: ['brandName', 'primaryColor'],
    dataSource: 'static'
  },
  {
    id: 'compatible-devices',
    component: 'CompatibleDevicesSection',
    order: 5,
    required: true,
    description: 'Supported devices and platforms showcase',
    requiredProps: ['brandName', 'primaryColor'],
    dataSource: 'static'
  },
  {
    id: 'pricing',
    component: 'PricingSection',
    order: 6,
    required: true,
    description: 'Pricing cards with device tabs (1-5 devices)',
    requiredProps: ['plans', 'primaryColor', 'paymentSettings', 'brandName'],
    dataSource: 'collection'
  },
  {
    id: 'faq',
    component: 'FAQSection',
    order: 7,
    required: true,
    description: 'Frequently asked questions accordion',
    requiredProps: ['items'],
    dataSource: 'collection'
  }
];

export function getSectionDefinition(sectionId: RequiredSection): SectionDefinition | undefined {
  return SECTION_DEFINITIONS.find(s => s.id === sectionId);
}

export function getOrderedSections(): SectionDefinition[] {
  return [...SECTION_DEFINITIONS].sort((a, b) => a.order - b.order);
}

export function getRequiredSections(): SectionDefinition[] {
  return SECTION_DEFINITIONS.filter(s => s.required);
}

export interface SectionValidationResult {
  valid: boolean;
  missing: RequiredSection[];
  errors: string[];
}

export function validateSections(includedSections: RequiredSection[]): SectionValidationResult {
  const errors: string[] = [];
  const missing: RequiredSection[] = [];
  
  for (const required of REQUIRED_SECTIONS) {
    if (!includedSections.includes(required)) {
      missing.push(required);
      const def = getSectionDefinition(required);
      errors.push(`Missing required section: ${required} (${def?.description || 'unknown'})`);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    errors
  };
}

export function validateHomepageContent(content: {
  hasServiceInfo: boolean;
  hasPricingPlans: boolean;
  hasFAQItems: boolean;
}): SectionValidationResult {
  const errors: string[] = [];
  const missing: RequiredSection[] = [];
  
  if (!content.hasServiceInfo) {
    errors.push('Missing service-info content collection - required for hero and other sections');
  }
  
  if (!content.hasPricingPlans) {
    missing.push('pricing');
    errors.push('Missing pricing plans content - PricingSection requires plans data');
  }
  
  if (!content.hasFAQItems) {
    missing.push('faq');
    errors.push('Missing FAQ items content - FAQSection requires items data');
  }
  
  return {
    valid: errors.length === 0,
    missing,
    errors
  };
}

export const SECTION_META = {
  'hero': {
    title: 'Hero Section',
    description: 'Main hero banner with brand messaging and stats',
    props: ['title', 'subtitle', 'channelCount', 'vodCount', 'primaryColor']
  },
  'films-series': {
    title: 'Films & Series',
    description: 'Showcase of movie and TV series library',
    props: ['brandName', 'primaryColor']
  },
  'sports': {
    title: 'Sports Coverage',
    description: 'Live sports channels and events showcase',
    props: ['brandName', 'primaryColor']
  },
  'money-back-guarantee': {
    title: '100% Money Back Guarantee',
    description: 'Trust-building guarantee section',
    props: ['brandName', 'primaryColor']
  },
  'how-to-purchase': {
    title: 'How to Purchase',
    description: 'Step-by-step purchase instructions',
    props: ['primaryColor']
  },
  'compatible-devices': {
    title: 'Compatible Devices',
    description: 'Supported devices and platforms',
    props: ['brandName', 'primaryColor']
  },
  'pricing': {
    title: 'Pricing Plans',
    description: 'Pricing cards with device tabs (1-5 devices)',
    props: ['plans', 'primaryColor', 'paymentSettings', 'brandName']
  },
  'faq': {
    title: 'Frequently Asked Questions',
    description: 'Common questions and answers accordion',
    props: ['items']
  }
} as const;

export function escapeForTemplate(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}
