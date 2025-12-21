export interface TemplateTokens {
  id: string;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    sectionPadding: string;
    cardPadding: string;
    containerMaxWidth: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    card: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    button: string;
  };
  gradients: {
    hero: string;
    cta: string;
    accent: string;
  };
  heroLayout: 'centered' | 'split' | 'fullscreen';
  faqLayout: 'accordion' | 'cards' | 'split';
  pricingLayout: 'cards' | 'table' | 'stacked';
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  tokens: TemplateTokens;
  cssFile: string;
}

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, professional light theme with subtle gradients and rounded corners',
    tokens: {
      id: 'classic',
      name: 'Classic',
      description: 'Clean, professional design',
      fonts: { heading: 'Inter', body: 'Inter' },
      spacing: { sectionPadding: 'py-16 lg:py-24', cardPadding: 'p-6', containerMaxWidth: 'max-w-7xl' },
      borderRadius: { small: 'rounded', medium: 'rounded-lg', large: 'rounded-xl', card: 'rounded-xl' },
      shadows: { card: 'shadow-sm', cardHover: 'shadow-lg', button: 'shadow-none' },
      gradients: {
        hero: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        cta: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.05) 100%)',
        accent: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
      },
      heroLayout: 'centered',
      faqLayout: 'accordion',
      pricingLayout: 'cards'
    },
    cssFile: 'classic.css'
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek dark theme with glowing accents and deep shadows',
    tokens: {
      id: 'dark',
      name: 'Dark',
      description: 'Sleek dark theme',
      fonts: { heading: 'Inter', body: 'Inter' },
      spacing: { sectionPadding: 'py-20 lg:py-32', cardPadding: 'p-8', containerMaxWidth: 'max-w-7xl' },
      borderRadius: { small: 'rounded-lg', medium: 'rounded-xl', large: 'rounded-2xl', card: 'rounded-2xl' },
      shadows: { card: 'shadow-2xl', cardHover: 'shadow-[0_0_60px_rgba(var(--color-primary-rgb),0.15)]', button: 'shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]' },
      gradients: {
        hero: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
        cta: 'radial-gradient(ellipse at center, rgba(var(--color-primary-rgb),0.15) 0%, transparent 70%)',
        accent: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
      },
      heroLayout: 'fullscreen',
      faqLayout: 'cards',
      pricingLayout: 'cards'
    },
    cssFile: 'dark.css'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean minimalist design with lots of whitespace',
    tokens: {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra-clean design',
      fonts: { heading: 'Inter', body: 'Inter' },
      spacing: { sectionPadding: 'py-24 lg:py-40', cardPadding: 'p-8', containerMaxWidth: 'max-w-5xl' },
      borderRadius: { small: 'rounded-sm', medium: 'rounded', large: 'rounded-lg', card: 'rounded-lg' },
      shadows: { card: 'shadow-none', cardHover: 'shadow-sm', button: 'shadow-none' },
      gradients: {
        hero: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        cta: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        accent: 'none'
      },
      heroLayout: 'split',
      faqLayout: 'split',
      pricingLayout: 'table'
    },
    cssFile: 'minimal.css'
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk-inspired with glowing neon effects and angular shapes',
    tokens: {
      id: 'neon',
      name: 'Neon',
      description: 'Cyberpunk neon style',
      fonts: { heading: 'Orbitron', body: 'Inter' },
      spacing: { sectionPadding: 'py-24 lg:py-36', cardPadding: 'p-8', containerMaxWidth: 'max-w-7xl' },
      borderRadius: { small: 'rounded-none', medium: 'rounded-none', large: 'rounded-none', card: 'rounded-none' },
      shadows: { card: 'shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]', cardHover: 'shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.5)]', button: 'shadow-[0_0_20px_var(--color-primary)]' },
      gradients: {
        hero: 'radial-gradient(ellipse at 50% 0%, rgba(20,20,20,1) 0%, #0a0a0a 70%)',
        cta: 'radial-gradient(ellipse at 50% 100%, rgba(var(--color-primary-rgb),0.1) 0%, #0a0a0a 70%)',
        accent: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
      },
      heroLayout: 'centered',
      faqLayout: 'accordion',
      pricingLayout: 'cards'
    },
    cssFile: 'neon.css'
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Modern glassmorphism with blur effects and transparency',
    tokens: {
      id: 'glass',
      name: 'Glass',
      description: 'Glassmorphism style',
      fonts: { heading: 'Inter', body: 'Inter' },
      spacing: { sectionPadding: 'py-20 lg:py-28', cardPadding: 'p-6', containerMaxWidth: 'max-w-7xl' },
      borderRadius: { small: 'rounded-xl', medium: 'rounded-2xl', large: 'rounded-3xl', card: 'rounded-2xl' },
      shadows: { card: 'shadow-xl', cardHover: 'shadow-2xl', button: 'shadow-lg' },
      gradients: {
        hero: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(236,72,153,0.1) 100%)',
        cta: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.1) 100%)',
        accent: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
      },
      heroLayout: 'centered',
      faqLayout: 'cards',
      pricingLayout: 'stacked'
    },
    cssFile: 'glass.css'
  }
];

export const REQUIRED_SECTIONS = [
  'hero',
  'films-series',
  'sports',
  'money-back-guarantee',
  'how-to-purchase',
  'compatible-devices',
  'pricing',
  'faq'
] as const;

export type RequiredSection = typeof REQUIRED_SECTIONS[number];

export function getTemplate(id: string): TemplateDefinition {
  const template = TEMPLATE_REGISTRY.find(t => t.id === id);
  if (!template) {
    console.warn(`Template "${id}" not found, falling back to classic`);
    return TEMPLATE_REGISTRY[0];
  }
  return template;
}

export function validateTemplateRegistry(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (TEMPLATE_REGISTRY.length !== 5) {
    errors.push(`Expected 5 templates, found ${TEMPLATE_REGISTRY.length}`);
  }
  
  const expectedIds = ['classic', 'dark', 'minimal', 'neon', 'glass'];
  for (const id of expectedIds) {
    if (!TEMPLATE_REGISTRY.find(t => t.id === id)) {
      errors.push(`Missing required template: ${id}`);
    }
  }
  
  for (const template of TEMPLATE_REGISTRY) {
    if (!template.tokens) {
      errors.push(`Template "${template.id}" missing tokens`);
    }
    if (!template.cssFile) {
      errors.push(`Template "${template.id}" missing cssFile`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
