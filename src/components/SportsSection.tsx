interface SportsSectionProps {
  brandName?: string;
  primaryColor?: string;
}

const leagues = [
  { name: 'Soccer', icon: 'soccer', description: 'Premier League, La Liga, Serie A & more' },
  { name: 'Local Channels', icon: 'tv', description: 'Regional sports networks' },
  { name: 'International', icon: 'globe', description: 'Worldwide sports coverage' },
  { name: 'NFL', icon: 'football', description: 'American Football' },
  { name: 'NHL', icon: 'hockey', description: 'Ice Hockey' },
];

export default function SportsSection({ brandName = 'IPTV', primaryColor }: SportsSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'soccer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          </svg>
        );
      case 'tv':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3l-5 4-5-4" />
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
          </svg>
        );
      case 'football':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <ellipse cx="12" cy="12" rx="10" ry="6" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M8 9l4 3 4-3" />
          </svg>
        );
      case 'hockey':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L12 12l7 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-container bg-background" id="sports">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Experience Every Game Live
          </h2>
          <p className="section-subtitle">
            Catch all the action from the NFL, NBA, MLB, NHL, UFC, and international leagues - live and in high definition.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {leagues.map((league) => (
            <div key={league.name} className="content-card text-center group hover:scale-105 transition-all duration-300">
              <div className="aspect-square flex flex-col items-center justify-center p-4">
                <div className="text-primary mb-3 group-hover:scale-110 transition-transform">
                  {getIcon(league.icon)}
                </div>
                <h3 className="font-bold text-lg uppercase tracking-wide">{league.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{league.description}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                  LIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
