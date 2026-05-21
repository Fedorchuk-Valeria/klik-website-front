import Footer from "@/src/components/ui/Footer/Footer";
import HeaderPlatform from "@/src/components/ui/HeaderPlatform/HeaderPlatform";

export type LayoutPlatformProps = Readonly<{
  children: React.ReactNode;
  headerVariant?: "dark" | "light";
  showAuthControls?: boolean;
}>;

export default function LayoutPlatform({
   children,
   headerVariant = "dark",
   showAuthControls = true,
   }: LayoutPlatformProps) {
  return (
    <div className="platform-layout">
      <HeaderPlatform
        variant={headerVariant}
        showAuthControls={showAuthControls}
      />

      <main className="platform-layout__content">
        {children}
      </main>

      <Footer />
    </div>
  );
}
