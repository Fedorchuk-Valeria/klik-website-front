import type { Metadata } from "next";
import '../src/assets/scss/index.scss';
import Header from "@/src/components/ui/Header/Header";
import Footer from "@/src/components/ui/Footer/Footer";

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
    <html
      lang="ru"
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
