import { PRICES_SOURCE_URL } from "@/src/utils/constant";

export async function GET() {
  const response = await fetch(PRICES_SOURCE_URL);

  if (!response.ok) {
    return new Response("Failed to fetch price current document", { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="price-current.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
