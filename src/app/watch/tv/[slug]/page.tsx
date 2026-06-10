import { Metadata } from "next";
import { getLocalContent } from "@/lib/content";
import { buildTvMetadata, formatBilingualTitle } from "@/lib/seo";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { TV_SERVERS, VideoServer } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import WatchTVClient from "./WatchTVClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

function parseId(slug: string) {
  if (!slug) return null;
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = parseId(slug);
  if (!id) return { title: "مسلسل غير موجود" };

  const local = await getLocalContent(id);

  if (!local) {
    return { title: "مسلسل غير موجود" };
  }

  const data = local;
  const titleAr =
    local?.title_ar || local?.title || data?.title || "";
  const titleEn =
    local?.title_en || local?.title || "";
  const year = (
    data?.release_date ||
    data?.first_air_date ||
    local?.release_date ||
    local?.first_air_date ||
    "2026"
  ).substring(0, 4);
  const genreLabel = data?.genres?.[0]?.name;

  return buildTvMetadata({
    title: titleAr,
    titleEn,
    year,
    genreLabel,
    slug,
    local,
    posterPath: data?.poster_path,
    overview: local?.ai_content?.desc_ar || data?.overview,
  });
}

export default async function WatchTVPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { season, episode } = await searchParams;
  const id = parseId(slug);
  if (!id) notFound();

  const local = await getLocalContent(id);

  if (!local) notFound();

  const data = local;
  const ai = local?.ai_content;

  const titleAr =
    local?.title_ar ||
    local?.title ||
    data.title ||
    "";
  const titleEn =
    local?.title_en ||
    local?.title ||
    "";
  const displayTitle = formatBilingualTitle(titleAr, titleEn);
  const overview = data.overview || ai?.desc_ar || "";
  const year = (
    data.release_date ||
    data.first_air_date ||
    local?.release_date ||
    local?.first_air_date ||
    "2026"
  ).substring(0, 4);
  const rating = data.vote_average?.toFixed(1);
  const genres = data.genres?.map((g: any) => g.name).join(" • ");
  const backdrop = data.backdrop_path ? `/t/p/original${data.backdrop_path}` : "";
  const poster = data.poster_path ? `/t/p/w500${data.poster_path}` : "";

  const selectedSeason = season ? parseInt(season) : 1;
  const selectedEpisode = episode ? parseInt(episode) : 1;

  return (
    <div className="relative min-h-screen bg-[#000] text-white">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-30 bg-black/80 backdrop-blur-sm">
        <Navbar />
      </div>

      {/* Hero Background */}
      {backdrop && (
        <div className="absolute inset-0 h-[50vh] bg-cover bg-center">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 z-0"
            style={{ backgroundImage: `url('${backdrop}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/50 via-[#000000]/80 to-[#000000]" />
        </div>
      )}

      {/* Content */}
      <div className="relative pt-24 pb-8 container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="h-[38px] mb-6">
          <Breadcrumbs items={[
            { name: "الرئيسية", item: "/" },
            { name: "مسلسلات", item: "/tv" },
            { name: displayTitle, item: `/tv/${slug}` }
          ]} />
        </div>

        {/* TV Show Info Row */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Poster */}
          {poster && (
            <div className="flex-shrink-0 w-48 lg:w-64 mx-auto lg:mx-0">
              <img
                src={poster}
                alt={displayTitle}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{displayTitle}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-base font-bold">{rating}</span>
                </div>
              )}
              {data.number_of_seasons && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 4v16M17 4v16M3 8h4M10 8h4M17 8h4M3 16h4M10 16h4M17 16h4"/>
                  </svg>
                  {data.number_of_seasons} مواسم
                </div>
              )}
              {data.number_of_episodes && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {data.number_of_episodes} حلقة
                </div>
              )}
              {data.first_air_date && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {year}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data.genres?.map((g: any) => (
                <span key={g.id} className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed mb-6">
              {overview || "لا يوجد وصف متاح"}
            </p>
          </div>
        </div>

        {/* Client Component for Interactive Parts */}
        <WatchTVClient
          id={parseInt(id)}
          slug={slug}
          title={displayTitle}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          data={data}
        />
      </div>
    </div>
  );
}
