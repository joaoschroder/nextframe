"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingDots from "./components/LoadingDots";

type Pick = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  poster_path?: string | null;
  imdb_url?: string | null;
};

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [movie, setMovie] = useState<Pick | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function nextFrame() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/tmdb");
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      setMovie(data);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // optional: fetch one pick on first load (so it looks like your prototype)
  useEffect(() => {
    nextFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posterUrl =
    movie?.poster_path ? `${TMDB_IMG}${movie.poster_path}` : null;

  return (
    <main className="h-[calc(100svh-56px)] px-4">
      <div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center text-center">

        <h1 className="text-3xl text-white font-extrabold tracking-tight">NextFrame</h1>
        <p className="mt-2 text-sm text-slate-400 mb-5">
          Your next movie one click away.
        </p>

        <div className="relative mx-auto w-full max-w-[70vw]">
          <div className="relative mx-auto aspect-2/3 max-h-[55svh] w-full overflow-hidden rounded-xl bg-slate-800">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingDots />
              </div>
            ) : posterUrl ? (
              <a
                href={movie?.imdb_url ?? undefined}
                target="_blank"
                rel="noreferrer"
                className={
                  movie?.imdb_url
                    ? "block h-full w-full"
                    : "pointer-events-none block h-full w-full"
                }
                title={movie?.imdb_url ? "Open on IMDb" : "IMDb link unavailable"}
              >
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie?.title ?? "Movie poster"}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    No poster available
                  </div>
                )}
              </a>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-sm text-slate-300">
                No poster available.
              </div>
            )}
          </div>

          {/* Movie title */}
          <div className="mt-3">
            <h2 className="mt-1 line-clamp-2 text-base font-semibold text-white">
              {movie?.title ?? (loading ? "" : "—")}
            </h2>
          </div>

          {/* Button */}
          <button
            onClick={nextFrame}
            disabled={loading}
            className="mt-4 w-full cursor-pointer rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next Frame
          </button>

          {err && <p className="mt-3 text-xs text-red-400">{err}</p>}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Tip: tap the poster to open IMDb.
        </p>
      </div>
    </main>
  );
}
