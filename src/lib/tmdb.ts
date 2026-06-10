export const TMDB_API_KEY = "882e741f7283dc9ba1654d4692ec30f6";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "/t/p/w500";

export async function getTMDBData(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getDetails(id: string, type: "movie" | "tv") {
  const [ar, en, credits, similar, videos] = await Promise.all([
    getTMDBData(`${type}/${id}`, { language: "ar" }),
    getTMDBData(`${type}/${id}`, { language: "en" }),
    getTMDBData(`${type}/${id}/credits`),
    getTMDBData(`${type}/${id}/similar`, { language: "en-US" }),
    getTMDBData(`${type}/${id}/videos`),
  ]);
  return { ar, en, credits, similar, videos };
}

// Video server types and configuration
export interface VideoServer {
  id: string;
  name: string;
  movieUrl?: string;
  tvUrl?: string;
  baseUrl?: string;
  quality: string;
  icon: string;
  color?: string;
  description?: string;
  useIdType?: 'tmdb' | 'imdb';
  subtitles?: string;
  vip?: boolean;
  format?: string;
  supportsSeasons?: boolean;
  allowSubtitlesParam?: boolean;
  allowTmdb?: boolean;
  allowSeasonEpisode?: boolean;
  useTmdbParam?: boolean;
  supportsParams?: boolean;
  supportsImdbParam?: boolean;
  supportsTmdbParam?: boolean;
  supportsSubLang?: boolean;
  supportsAutoPlay?: boolean;
  domains?: string[];
}

export const MOVIE_SERVERS: VideoServer[] = [
  {
    id: 'server_1',
    name: 'سيرفر 1',
    movieUrl: 'https://vidsrc-embed.ru/embed/movie',
    tvUrl: 'https://vidsrc-embed.ru/embed/tv',
    quality: 'FHD',
    icon: 'star',
    color: '#16a085',
    description: 'سيرفر سريع',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_2',
    name: 'سيرفر 2',
    movieUrl: 'https://vidsrc-embed.su/embed/movie',
    tvUrl: 'https://vidsrc-embed.su/embed/tv',
    quality: 'FHD',
    icon: 'database',
    color: '#e67e22',
    description: 'سيرفر احتياطي',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_3',
    name: 'سيرفر 3',
    movieUrl: 'https://vidsrcme.su/embed/movie',
    tvUrl: 'https://vidsrcme.su/embed/tv',
    quality: 'FHD',
    icon: 'rocket',
    color: '#e74c3c',
    description: 'سيرفر بديل',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_4',
    name: 'سيرفر 4',
    movieUrl: 'https://vsrc.su/embed/movie',
    tvUrl: 'https://vsrc.su/embed/tv',
    quality: 'FHD',
    icon: 'film',
    description: 'سيرفر احتياطي',
    color: '#1abc9c',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_5',
    name: 'سيرفر 5',
    movieUrl: 'https://vidsrcme.ru/embed/movie',
    tvUrl: 'https://vidsrcme.ru/embed/tv',
    quality: 'FHD',
    icon: 'tv',
    color: '#c0392b',
    description: 'سيرفر بديل',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_6',
    name: 'سيرفر 6',
    movieUrl: 'https://vidsrc-me.ru/embed/movie',
    tvUrl: 'https://vidsrc-me.ru/embed/tv',
    quality: 'FHD',
    icon: 'sync',
    color: '#27ae60',
    description: 'سيرفر احتياطي',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  }
];

export const TV_SERVERS: VideoServer[] = [
  {
    id: 'server_1',
    name: 'سيرفر 1',
    movieUrl: 'https://vidsrc-embed.ru/embed/movie',
    tvUrl: 'https://vidsrc-embed.ru/embed/tv',
    quality: 'FHD',
    icon: 'star',
    color: '#16a085',
    description: 'سيرفر سريع',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_2',
    name: 'سيرفر 2',
    movieUrl: 'https://vidsrc-embed.su/embed/movie',
    tvUrl: 'https://vidsrc-embed.su/embed/tv',
    quality: 'FHD',
    icon: 'database',
    color: '#e67e22',
    description: 'سيرفر احتياطي',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_3',
    name: 'سيرفر 3',
    movieUrl: 'https://vidsrcme.su/embed/movie',
    tvUrl: 'https://vidsrcme.su/embed/tv',
    quality: 'FHD',
    icon: 'rocket',
    color: '#e74c3c',
    description: 'سيرفر بديل',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_4',
    name: 'سيرفر 4',
    movieUrl: 'https://vsrc.su/embed/movie',
    tvUrl: 'https://vsrc.su/embed/tv',
    quality: 'FHD',
    icon: 'film',
    description: 'سيرفر احتياطي',
    color: '#1abc9c',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_5',
    name: 'سيرفر 5',
    movieUrl: 'https://vidsrcme.ru/embed/movie',
    tvUrl: 'https://vidsrcme.ru/embed/tv',
    quality: 'FHD',
    icon: 'tv',
    color: '#c0392b',
    description: 'سيرفر بديل',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  },
  {
    id: 'server_6',
    name: 'سيرفر 6',
    movieUrl: 'https://vidsrc-me.ru/embed/movie',
    tvUrl: 'https://vidsrc-me.ru/embed/tv',
    quality: 'FHD',
    icon: 'sync',
    color: '#27ae60',
    description: 'سيرفر احتياطي',
    useIdType: 'tmdb',
    subtitles: 'ar',
    supportsParams: true,
    supportsTmdbParam: true,
    supportsSubLang: true,
    supportsAutoPlay: true
  }
];

// Get video URL with proper parameters
export function getVideoUrl(
  server: VideoServer,
  id: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number,
  imdbId?: string,
  options?: {
    autoplay?: boolean;
    autonext?: boolean;
    subtitleLang?: string;
    subtitleUrl?: string;
  }
): string {
  let baseUrl = '';
  const finalId = server.useIdType === 'imdb' ? (imdbId || id) : id;

  if (type === "movie") {
    baseUrl = server.movieUrl || "";

    // Use query parameters format for vidsrc servers
    const params = new URLSearchParams();
    params.append('tmdb', id.toString());
    if (imdbId) params.append('imdb', imdbId);
    if (options?.subtitleLang) params.append('ds_lang', options.subtitleLang);
    if (options?.subtitleUrl) params.append('sub_url', options.subtitleUrl);
    if (options?.autoplay !== false) params.append('autoplay', '1');

    return `${baseUrl}?${params.toString()}`;
  } else {
    // TV Show
    baseUrl = server.tvUrl || "";

    // Use query parameters format for vidsrc servers
    const params = new URLSearchParams();
    params.append('tmdb', id.toString());
    if (imdbId) params.append('imdb', imdbId);
    if (season !== undefined) params.append('season', season.toString());
    if (episode !== undefined) params.append('episode', episode.toString());
    if (options?.subtitleLang) params.append('ds_lang', options.subtitleLang);
    if (options?.subtitleUrl) params.append('sub_url', options.subtitleUrl);
    if (options?.autoplay !== false) params.append('autoplay', '1');
    if (options?.autonext) params.append('autonext', '1');

    return `${baseUrl}?${params.toString()}`;
  }
}

// Helper to get IMDB ID from TMDB API
export async function getImdbIdFromTmdb(id: number, type: "movie" | "tv"): Promise<string | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}/external_ids?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.imdb_id || null;
  } catch (error) {
    console.error("Failed to fetch IMDB ID:", error);
    return null;
  }
}

// Get server by ID
export function getServerById(id: string): VideoServer | undefined {
  const ALL_SERVERS = [...MOVIE_SERVERS, ...TV_SERVERS];
  return ALL_SERVERS.find(server => server.id === id);
}
