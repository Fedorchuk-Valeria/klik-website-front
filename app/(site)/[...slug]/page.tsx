import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getPage } from "@/src/lib/getPage";
import { resolveTemplate } from "@/src/lib/resolveTemplate";

function slugFromParams(segments: string[] | undefined) {
  if (!segments?.length) return "home";

  return segments.join("/");
}

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const p = await params;

  const h = await headers();

  const city = h.get("x-city");
  const slug = slugFromParams(p.slug);

  if (!city) return {};

  const page = getPage(city, slug);

  if (!page) return {};

  return {
    title: page.seo.title,
    description: page.seo.description,
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;

  const h = await headers();

  const city = h.get("x-city");
  const slug = slugFromParams(p.slug);

  if (!city) notFound();

  const page = getPage(city, slug);

  if (!page) notFound();

  return resolveTemplate(page.template)({ page });
}
