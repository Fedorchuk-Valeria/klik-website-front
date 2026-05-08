import type { Metadata } from "next";

import Footer from "@/src/components/ui/Footer/Footer";
import Header from "@/src/components/ui/Header/Header";

import WidgetModal from "@/src/widgets/Modal";

import { StoreProvider } from "@/src/store/StoreProvider";

import "@/src/assets/scss/index.scss";
import AnchorScroll from "@/src/components/AnchorScroll/AnchorScroll";

export const metadata: Metadata = {
  title: "Онлайн школа",
  description: "Онлайн школа",
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
          <Header />
          {children}
          <WidgetModal />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
