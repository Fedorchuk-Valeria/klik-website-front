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
import Script from "next/script";

export const metadata: Metadata = {
  title: "Онлайн школа",
  description: "Онлайн школа",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const GTM = "GTM-5G7ZFV9P";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM}');
    `,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>
        <StoreProvider>
          <AuthReferrerTracker />
          <AnchorScroll />
          {children}
          <WidgetModal />

          <CookiePolicyListener />
          <PlaceListener />
          <GetUserListener />
          <ProfileNotificationListener />
        </StoreProvider>
      </body>
    </html>
  );
}
