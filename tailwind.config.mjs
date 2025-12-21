/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #3b82f6)',
          foreground: 'var(--color-primary-foreground, #ffffff)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #8b5cf6)',
          foreground: 'var(--color-secondary-foreground, #ffffff)',
        },
        background: 'var(--color-background, #ffffff)',
        foreground: 'var(--color-foreground, #0f172a)',
        muted: {
          DEFAULT: 'var(--color-muted, #f1f5f9)',
          foreground: 'var(--color-muted-foreground, #64748b)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #f1f5f9)',
          foreground: 'var(--color-accent-foreground, #0f172a)',
        },
        card: {
          DEFAULT: 'var(--color-card, #ffffff)',
          foreground: 'var(--color-card-foreground, #0f172a)',
        },
        border: 'var(--color-border, #e2e8f0)',
        ring: 'var(--color-ring, #3b82f6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
