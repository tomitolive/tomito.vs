"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { TV_SERVERS, VideoServer } from "@/lib/tmdb";

interface WatchTVClientProps {
  id: number;
  slug: string;
  title: string;
  selectedSeason: number;
  selectedEpisode: number;
  data: any;
}

export default function WatchTVClient({
  id,
  slug,
  title,
  selectedSeason,
  selectedEpisode,
  data,
}: WatchTVClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeServerId, setActiveServerId] = useState<string>(TV_SERVERS[0].id);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  const validSeasons = data.seasons?.filter((s: any) => s.season_number > 0) || [];

  const handleNavigate = (season: number, episode: number) => {
    router.push(`/watch/tv/${slug}?season=${season}&episode=${episode}`);
  };

  const switchServer = (serverId: string) => {
    setActiveServerId(serverId);
  };

  const activeServer = TV_SERVERS.find((s) => s.id === activeServerId) || TV_SERVERS[0];

  return (
    <>
      {/* Season Selection */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative">
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-white"
          >
            الموسم {selectedSeason}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${isSeasonDropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {isSeasonDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
              {validSeasons.map((season: any) => (
                <button
                  key={season.id}
                  onClick={() => {
                    handleNavigate(season.season_number, 1);
                    setIsSeasonDropdownOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2 hover:bg-zinc-700 transition-colors ${
                    selectedSeason === season.season_number
                      ? "bg-orange-500 text-white"
                      : "text-gray-300"
                  }`}
                >
                  {season.name} ({season.episode_count} حلقة)
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <h2 className="text-xl font-bold">
            الموسم {selectedSeason} - الحلقة {selectedEpisode}
          </h2>
        </div>

        {/* Server Selection */}
        <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
          {TV_SERVERS.map((server) => {
            const isActive = server.id === activeServerId;
            return (
              <button
                key={server.id}
                onClick={() => switchServer(server.id)}
                className={`h-9 px-4 rounded-lg transition-all backdrop-blur-md shadow-sm border flex items-center gap-2 ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-zinc-800/50 text-gray-400 hover:text-white border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wide">
                  {server.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            id={id}
            type="tv"
            title={title}
            season={selectedSeason}
            episode={selectedEpisode}
            currentServer={activeServer}
          />
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">حلقات الموسم {selectedSeason}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: validSeasons.find((s: any) => s.season_number === selectedSeason)?.episode_count || 0 }, (_, i) => i + 1).map((episodeNum) => (
            <button
              key={episodeNum}
              onClick={() => handleNavigate(selectedSeason, episodeNum)}
              className={`p-3 text-right rounded-lg border transition-all ${
                selectedEpisode === episodeNum
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className="aspect-video bg-zinc-700 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <p className="font-medium text-sm text-white">حلقة {episodeNum}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
