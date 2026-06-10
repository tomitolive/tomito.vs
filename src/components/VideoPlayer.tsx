"use client";

import { useState, useEffect, useRef } from "react";
import {
  VideoServer,
  MOVIE_SERVERS,
  TV_SERVERS,
  getVideoUrl,
  getImdbIdFromTmdb,
} from "@/lib/tmdb";

interface VideoPlayerProps {
  id: number;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  onNavigate?: (season: number, episode: number) => void;
  currentServer?: VideoServer;
}

export function VideoPlayer({
  id,
  type,
  title,
  season,
  episode,
  onNavigate,
  currentServer: externalServer,
}: VideoPlayerProps) {
  const servers = type === "movie" ? MOVIE_SERVERS : TV_SERVERS;
  const [internalServer, setInternalServer] = useState<VideoServer>(servers[0]);
  const currentServer = externalServer || internalServer;

  const [imdbId, setImdbId] = useState<string | undefined>(undefined);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with browser changes (Esc key, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to toggle full-screen mode:", err);
    }
  };


  // Fetch IMDB ID if needed
  useEffect(() => {
    const fetchIds = async () => {
      if (currentServer.useIdType === 'imdb' && !imdbId) {
        const idResult = await getImdbIdFromTmdb(id, type);
        if (idResult) setImdbId(idResult);
      }
    };
    fetchIds();
  }, [id, type, currentServer.id, imdbId]);

  const videoUrl = getVideoUrl(
    currentServer,
    id,
    type,
    season,
    episode,
    imdbId,
    {
      autoplay: true,
    }
  );

  const handleServerChange = (serverId: string) => {
    const selectedServer = servers.find(s => s.id === serverId);
    if (selectedServer) {
      setKey(prev => prev + 1); // Force iframe reload first
      setTimeout(() => {
        setInternalServer(selectedServer);
      }, 100);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative group/player w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-zinc-800"
    >
      <iframe
        key={key}
        src={videoUrl}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; web-share; accelerometer; gyroscope"
        title={`${title} - ${currentServer.name}`}
        allowFullScreen
      />

      {/* Server Selection */}
      <div className="absolute top-4 right-4 z-[9999]">
        <div className="bg-black/60 backdrop-blur-md rounded-lg border border-orange-500/30">
          <select
            value={currentServer.id}
            onChange={(e) => handleServerChange(e.target.value)}
            className="bg-transparent text-white px-3 py-2 rounded-lg border-0 outline-none cursor-pointer text-sm font-medium min-w-[150px]"
          >
            {servers.map((server) => (
              <option key={server.id} value={server.id} className="bg-zinc-900 text-white">
                {server.name} ({server.quality})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fullscreen Button */}
      <div className="absolute bottom-4 right-4 z-[9999] opacity-100 lg:opacity-0 lg:group-hover/player:opacity-100 transition-opacity pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="h-10 w-10 bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md shadow-2xl rounded-full pointer-events-auto flex items-center justify-center"
        >
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
