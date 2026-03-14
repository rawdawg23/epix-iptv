import { useEffect, useState } from 'react';
import { Film, Tv, Loader2 } from 'lucide-react';

type MediaItem = {
  id: number;
  title: string;
  poster: string | null;
  date: string;
  overview: string;
  rating?: number;
  type: 'movie' | 'tv';
};

type FeaturedResponse = {
  movies: MediaItem[];
  tv: MediaItem[];
  imageBase?: string;
  error?: string;
};

const categoryCards = [
  { id: 'sports', label: 'Serie A', sub: 'Football', theme: 'from-green-900/90 to-blue-900/90' },
  {
    id: 'leagues',
    label: 'Top Leagues',
    sub: 'Premier League · La Liga · UEFA',
    theme: 'from-slate-900/95 to-slate-800/95',
  },
];

function formatDate(dateStr: string, type: 'movie' | 'tv') {
  if (!dateStr) return type === 'movie' ? 'Coming soon' : 'New';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function MediaCard({ item }: { item: MediaItem }) {
  const year = formatDate(item.date, item.type);
  return (
    <a
      href={`https://www.themoviedb.org/${item.type}/${item.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] snap-center rounded-2xl overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            {item.type === 'movie' ? <Film className="h-12 w-12" /> : <Tv className="h-12 w-12" />}
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-bold text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-md">
            {item.title}
          </p>
          {year && (
            <p className="text-xs text-white/80 mt-1 uppercase tracking-wide">{year}</p>
          )}
        </div>
        {item.type === 'tv' && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold uppercase bg-primary text-primary-foreground rounded">
            TV
          </span>
        )}
      </div>
    </a>
  );
}

function CategoryCard({ label, sub, theme }: { label: string; sub: string; theme: string }) {
  return (
    <div
      className={`flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] snap-center rounded-2xl overflow-hidden border border-border bg-gradient-to-b ${theme} flex flex-col items-center justify-center min-h-[280px] p-6 text-center hover:scale-[1.02] transition-transform duration-300 cursor-default`}
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      </div>
      <p className="font-bold text-white text-lg uppercase tracking-wide">{label}</p>
      <p className="text-white/80 text-xs mt-1">{sub}</p>
    </div>
  );
}

export default function TMDBMediaCarousel() {
  const [data, setData] = useState<FeaturedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/tmdb/featured')
      .then((r) => r.json())
      .then((json: FeaturedResponse) => {
        if (!cancelled) {
          setData(json);
          if (json.error && (json.movies?.length ?? 0) === 0) setError(json.error);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load content');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="section-container bg-muted/30" id="watch-now">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Movies &amp; Series</h2>
            <p className="section-subtitle">Popular now — powered by TMDB</p>
          </div>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const movies = data?.movies ?? [];
  const tv = data?.tv ?? [];
  const hasMedia = movies.length > 0 || tv.length > 0;

  return (
    <section className="section-container bg-muted/30" id="watch-now">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Movies &amp; Series</h2>
          <p className="section-subtitle">
            {hasMedia
              ? 'Popular now — stream with Epix IPTV'
              : 'Connect TMDB in your dashboard to show popular movies and TV here.'}
          </p>
        </div>

        {error && !hasMedia && (
          <p className="text-center text-muted-foreground text-sm mb-8">
            Add <code className="bg-muted px-1 rounded">TMDB_API_KEY</code> in Vercel to enable.
          </p>
        )}

        {/* Horizontal scroll row: category cards + movies + TV mix */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">
              Sports &amp; Leagues
            </h3>
            <div className="flex gap-4 pb-4 snap-x snap-mandatory scroll-smooth carousel-scroll">
              {categoryCards.map((c) => (
                <CategoryCard key={c.id} label={c.label} sub={c.sub} theme={c.theme} />
              ))}
            </div>
          </div>

          {movies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">
                Popular Movies
              </h3>
              <div className="flex gap-4 pb-4 snap-x snap-mandatory scroll-smooth carousel-scroll">
                {movies.map((item) => (
                  <MediaCard key={`m-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          )}

          {tv.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">
                Popular TV Shows
              </h3>
              <div className="flex gap-4 pb-4 snap-x snap-mandatory scroll-smooth carousel-scroll">
                {tv.map((item) => (
                  <MediaCard key={`t-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
