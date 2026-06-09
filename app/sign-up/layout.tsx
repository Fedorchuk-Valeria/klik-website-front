import LoginLayout from "@/src/components/LoginLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginLayout>{children}</LoginLayout>;
}
