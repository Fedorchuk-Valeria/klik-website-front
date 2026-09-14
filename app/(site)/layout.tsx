import Footer from "@/src/components/ui/Footer/Footer";
import Header from "@/src/components/ui/Header/Header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
