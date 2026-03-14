import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = { runtime: 'nodejs' };

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview?: string;
  vote_average?: number;
};

type TmdbTv = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview?: string;
  vote_average?: number;
};

/** Public API: returns popular movies and TV from TMDB for carousel. No auth. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.TMDB_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'TMDB not configured',
      movies: [],
      tv: [],
    });
  }

  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE}/movie/popular?api_key=${key}&language=en-US&page=1`),
      fetch(`${TMDB_BASE}/tv/popular?api_key=${key}&language=en-US&page=1`),
    ]);

    if (!moviesRes.ok || !tvRes.ok) {
      const err = await moviesRes.text().catch(() => '') || await tvRes.text().catch(() => '');
      console.error('TMDB error', moviesRes.status, tvRes.status, err);
      return res.status(502).json({
        error: 'TMDB request failed',
        movies: [],
        tv: [],
      });
    }

    const [moviesJson, tvJson] = await Promise.all([
      moviesRes.json() as Promise<{ results: TmdbMovie[] }>,
      tvRes.json() as Promise<{ results: TmdbTv[] }>,
    ]);

    const movies = (moviesJson.results || []).slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
      date: m.release_date || '',
      overview: m.overview || '',
      rating: m.vote_average,
      type: 'movie' as const,
    }));

    const tv = (tvJson.results || []).slice(0, 12).map((t) => ({
      id: t.id,
      title: t.name,
      poster: t.poster_path ? `${IMAGE_BASE}${t.poster_path}` : null,
      date: t.first_air_date || '',
      overview: t.overview || '',
      rating: t.vote_average,
      type: 'tv' as const,
    }));

    return res.status(200).json({
      movies,
      tv,
      imageBase: IMAGE_BASE,
    });
  } catch (e) {
    console.error('tmdb/featured', e);
    return res.status(500).json({
      error: 'Failed to fetch from TMDB',
      movies: [],
      tv: [],
    });
  }
}
