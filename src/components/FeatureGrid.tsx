import { 
  Tv, Film, Globe, Shield, Zap, Smartphone, 
  Clock, Users, Download, RefreshCw, Settings, Headphones 
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureGridProps {
  features: Feature[];
  primaryColor?: string;
}

const iconMap: Record<string, any> = {
  tv: Tv,
  film: Film,
  globe: Globe,
  shield: Shield,
  zap: Zap,
  smartphone: Smartphone,
  clock: Clock,
  users: Users,
  download: Download,
  refresh: RefreshCw,
  settings: Settings,
  headphones: Headphones,
};

export default function FeatureGrid({ features, primaryColor = '#3b82f6' }: FeatureGridProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience premium IPTV with cutting-edge features designed for your entertainment needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon.toLowerCase()] || Zap;
            return (
              <div 
                key={index}
                className="bg-card rounded-lg p-6 border border-border transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
