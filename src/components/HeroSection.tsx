import { Tv, Film, Clock, Headphones } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  channelCount: number;
  vodCount: number;
  primaryColor?: string;
}

export default function HeroSection({
  title,
  subtitle,
  channelCount,
  vodCount,
  primaryColor = '#3b82f6',
}: HeroSectionProps) {
  const stats = [
    { icon: Tv, label: 'Live Channels', value: `${channelCount}+` },
    { icon: Film, label: 'Movies & Series', value: `${vodCount}+` },
    { icon: Clock, label: 'Uptime', value: '99.9%' },
    { icon: Headphones, label: 'Support', value: '24/7' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/50 py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
            <span className="text-gradient">{title}</span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Get Started
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/features"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-8 py-3 text-base font-medium transition-colors hover:bg-accent"
            >
              Learn More
            </a>
          </div>
        </div>

        <div 
          className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div 
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
