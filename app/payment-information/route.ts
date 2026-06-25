import { PAYMENT_INFORMATION_SOURCE_URL } from "@/src/utils/constant";

export async function GET() {
  const response = await fetch(PAYMENT_INFORMATION_SOURCE_URL);

  if (!response.ok) {
    return new Response("Failed to fetch payment information document", { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="payment-information.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
