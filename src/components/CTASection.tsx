import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  primaryColor?: string;
}

export default function CTASection({
  title,
  subtitle,
  buttonText,
  buttonLink,
  primaryColor = '#3b82f6',
}: CTASectionProps) {
  return (
    <section 
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)`,
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        <a
          href={buttonLink}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-lg font-medium text-white transition-all hover:opacity-90 hover:gap-3"
          style={{ backgroundColor: primaryColor }}
        >
          {buttonText}
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
