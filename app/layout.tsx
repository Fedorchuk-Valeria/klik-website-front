import type { Metadata } from "next";

import AnchorScroll from "@/src/components/AnchorScroll/AnchorScroll";
import CookiePolicyListener from "@/src/components/template-parts/CookiePolicyListener";
import PlaceListener from "@/src/components/template-parts/PlaceListener";

import WidgetModal from "@/src/widgets/Modal";

import { StoreProvider } from "@/src/store/StoreProvider";

import "@/src/assets/scss/index.scss";
import GetUserListener from "@/src/components/template-parts/GetUserListener";

export const metadata: Metadata = {
  title: "Онлайн школа",
  description: "Онлайн школа",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <AnchorScroll />
          {children}
          <WidgetModal />

          <CookiePolicyListener />
          {/*<PlaceListener />*/}
          <GetUserListener />
        </StoreProvider>
      </body>
    </html>
  );
}
