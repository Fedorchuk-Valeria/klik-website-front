import type { Metadata } from "next";

import Footer from "@/src/components/ui/Footer/Footer";
import Header from "@/src/components/ui/Header/Header";

import WidgetModal from "@/src/widgets/Modal";

import { StoreProvider } from "@/src/store/StoreProvider";

import "../src/assets/scss/index.scss";

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
          <Header />
          {children}
          <WidgetModal />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
