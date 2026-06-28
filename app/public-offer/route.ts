import { PUBLIC_OFFER_SOURCE_URL } from "@/src/utils/constant";

export async function GET() {
  const response = await fetch(PUBLIC_OFFER_SOURCE_URL);

  if (!response.ok) {
    return new Response("Failed to fetch public offer document", { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="public-contract.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
