import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ANIME } from "@/data/anime";
import { AnimeDetail } from "@/components/anime/anime-detail";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://luxury-anime.vercel.app";

export function generateStaticParams() {
  return ANIME.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const anime = ANIME.find((a) => a.slug === params.slug);
  if (!anime) return {};

  // First 160 chars of synopsis for description
  const description = anime.synopsis.slice(0, 160).trimEnd() + "…";
  const heroUrl = `${BASE_URL}${anime.heroImage}`;

  return {
    title: anime.title,
    description,
    keywords: [
      anime.title,
      anime.protagonist.name,
      anime.antagonist.name,
      "anime",
      "manga",
      "cinematic",
    ],
    openGraph: {
      type: "article",
      url: `${BASE_URL}/anime/${anime.slug}`,
      title: `${anime.title} — Luxury Anime`,
      description,
      siteName: "Luxury Anime",
      images: [
        {
          url: heroUrl,
          width: 1920,
          height: 1080,
          alt: `${anime.title} key art`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${anime.title} — Luxury Anime`,
      description: anime.tagline,
      images: [heroUrl],
    },
    alternates: {
      canonical: `${BASE_URL}/anime/${anime.slug}`,
    },
  };
}

/** JSON-LD structured data for rich search results. */
function AnimeJsonLd({ slug }: { slug: string }) {
  const anime = ANIME.find((a) => a.slug === slug);
  if (!anime) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: anime.title,
    description: anime.synopsis,
    url: `${BASE_URL}/anime/${anime.slug}`,
    image: `${BASE_URL}${anime.heroImage}`,
    genre: "Anime",
    character: [
      {
        "@type": "Person",
        name: anime.protagonist.name,
        description: anime.protagonist.description,
      },
      {
        "@type": "Person",
        name: anime.antagonist.name,
        description: anime.antagonist.description,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function AnimePage({ params }: { params: { slug: string } }) {
  const anime = ANIME.find((a) => a.slug === params.slug);
  if (!anime) notFound();

  return (
    <>
      <AnimeJsonLd slug={params.slug} />
      <AnimeDetail anime={anime} />
    </>
  );
}
