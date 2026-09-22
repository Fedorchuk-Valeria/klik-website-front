import type { Metadata } from "next";

import AnchorScroll from "@/src/components/AnchorScroll/AnchorScroll";
import AuthReferrerTracker from "@/src/components/AuthReferrerTracker";
import CookiePolicyListener from "@/src/components/template-parts/CookiePolicyListener";

import WidgetModal from "@/src/widgets/Modal";

import { StoreProvider } from "@/src/store/StoreProvider";

import "@/src/assets/scss/index.scss";
import GetUserListener from "@/src/components/template-parts/GetUserListener";
import ProfileNotificationListener from "@/src/components/template-parts/ProfileNotificationListener";
import PlaceListener from "@/src/components/template-parts/PlaceListener";

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
          <AuthReferrerTracker />
          <AnchorScroll />
          {children}
          <WidgetModal />

          <CookiePolicyListener />
          {/*<PlaceListener />*/}
          <GetUserListener />
          <ProfileNotificationListener />
        </StoreProvider>
      </body>
    </html>
  );
}
