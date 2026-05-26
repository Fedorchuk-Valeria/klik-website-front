import { headers } from "next/headers";

import Footer from "@/src/components/ui/Footer/Footer";
import HeaderPlatform from "@/src/components/ui/HeaderPlatform/HeaderPlatform";

export type LayoutPlatformProps = Readonly<{
  children: React.ReactNode;
  headerVariant?: "dark" | "light";
  showAuthControls?: boolean;
}>;

export default async function LayoutPlatform({
  children,
  headerVariant = "dark",
  showAuthControls = true,
}: LayoutPlatformProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const id = pathname.match(/^\/courses\/([^/]+)$/)?.[1];

  return (
    <div className="platform-layout">
      <HeaderPlatform variant={id ? "light" : headerVariant} showAuthControls={showAuthControls} />
      <main className="platform-layout__content">{children}</main>
      <Footer />
    </div>
  );
}
