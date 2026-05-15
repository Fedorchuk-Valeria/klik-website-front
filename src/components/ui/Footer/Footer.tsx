import { headers } from "next/headers";

import FooterClient from "@/src/components/ui/Footer/FooterClient";

import { getCitySettings } from "@/src/lib/getCitySettings";

export type { FooterInfo, FooterWidget } from "@/src/components/ui/Footer/Footer.types";

export default async function Footer() {
  const headersList = await headers();
  const slug = headersList.get("x-city") ?? "minsk";

  const settings = getCitySettings(slug);

  return <FooterClient settings={settings} />;
}
