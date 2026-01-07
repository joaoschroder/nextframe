import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const MAX_PAGES = 500;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function tmdbFetch(url: string, revalidateSeconds = 60) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY missing");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
}

export async function GET() {
  try {
    // 1) get page 1 to know total_pages
    const page1Url = new URL(`${TMDB_BASE}/discover/movie`);
    page1Url.searchParams.set("include_adult", "false");
    page1Url.searchParams.set("language", "en-US");
    page1Url.searchParams.set("page", "1");
    page1Url.searchParams.set("sort_by", "popularity.desc");

    const page1 = await tmdbFetch(page1Url.toString(), 60);

    const totalPages = Math.min(Number(page1.total_pages ?? 1), MAX_PAGES);
    const hasResults = Array.isArray(page1.results) && page1.results.length > 0;
    if (!hasResults) {
      return NextResponse.json({ error: "No movies found." }, { status: 404 });
    }

    // 2) choose random page (reuse page1 if randomPage=1)
    const randomPage = randomInt(1, Math.max(1, totalPages));
    let pageData = page1;

    if (randomPage !== 1) {
      const pageUrl = new URL(`${TMDB_BASE}/discover/movie`);
      pageUrl.searchParams.set("include_adult", "false");
      pageUrl.searchParams.set("language", "en-US");
      pageUrl.searchParams.set("page", String(randomPage));
      pageUrl.searchParams.set("sort_by", "popularity.desc");

      pageData = await tmdbFetch(pageUrl.toString(), 60);
    }

    let results = pageData.results ?? [];

    // 3) light retry if that page is empty
    if (!Array.isArray(results) || results.length === 0) {
      const retryPage = randomInt(1, Math.max(1, totalPages));
      const retryUrl = new URL(`${TMDB_BASE}/discover/movie`);
      retryUrl.searchParams.set("include_adult", "false");
      retryUrl.searchParams.set("language", "en-US");
      retryUrl.searchParams.set("page", String(retryPage));
      retryUrl.searchParams.set("sort_by", "popularity.desc");

      const retryData = await tmdbFetch(retryUrl.toString(), 60);
      results = retryData.results ?? [];
    }

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "No movies found." }, { status: 404 });
    }

    // 4) pick random movie
    const movie = results[randomInt(0, results.length - 1)];

    // 5) get IMDb id
    const extUrl = new URL(`${TMDB_BASE}/movie/${movie.id}/external_ids`);
    const ext = await tmdbFetch(extUrl.toString(), 60);

    const imdbUrl = ext?.imdb_id ? `https://www.imdb.com/title/${ext.imdb_id}/` : null;

    return NextResponse.json({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      imdb_url: imdbUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
