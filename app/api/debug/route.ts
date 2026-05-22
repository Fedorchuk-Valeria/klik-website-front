import { headers } from "next/headers";

export async function GET() {
  const h = await headers();

  return Response.json({
    city: h.get("x-city"),
    host: h.get("host"),
  });
};
