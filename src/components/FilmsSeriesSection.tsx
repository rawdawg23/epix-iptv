interface FilmsSeriesSectionProps {
  brandName?: string;
  primaryColor?: string;
}

const categories = [
  { name: 'Action', count: '2,500+' },
  { name: 'Comedy', count: '1,800+' },
  { name: 'Drama', count: '3,200+' },
  { name: 'Sci-Fi', count: '950+' },
  { name: 'Horror', count: '680+' },
  { name: 'Documentary', count: '1,200+' },
];

const highlights = [
  { title: 'Latest Releases', description: 'New movies added weekly' },
  { title: 'Classic Films', description: 'Timeless entertainment' },
  { title: 'Exclusive Series', description: 'Complete seasons available' },
  { title: '4K Ultra HD', description: 'Crystal clear quality' },
];

export default function FilmsSeriesSection({ brandName = 'IPTV', primaryColor }: FilmsSeriesSectionProps) {
  return (
    <section className="section-container bg-muted/30" id="films-series">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Binge the Newest Blockbusters & All-Time Favorites
          </h2>
          <p className="section-subtitle">
            From the hottest new releases to your all-time favorites, {brandName} delivers non-stop movie magic with zero limits and zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <div key={category.name} className="content-card text-center hover:scale-105 transition-transform">
              <span className="text-lg font-semibold block">{category.name}</span>
              <span className="text-sm text-muted-foreground">{category.count}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div key={item.title} className="card-modern">
              <div className="feature-icon mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
