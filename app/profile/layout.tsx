import LayoutPlatform from "@/src/components/Layouts/LayoutPlatform";

export default function Layout({
   children,
   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutPlatform
      headerVariant="light"
      showAuthControls={true}
    >
      {children}
    </LayoutPlatform>
  );
}
