import Link from "next/link";

import Logo from "@/src/assets/images/logo-fill.svg";

import { PAGES } from "@/src/utils/constant";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="login-page">
      <div>
        <header className="login-page__header">
          <Link href={PAGES.HOME} className="login-page__logo">
            <Logo />
          </Link>

          <div className="login-page__logo-text">
            Дополнительное
            <br />
            IT-образование для детей
          </div>
        </header>

        <main className="login-page__main">{children}</main>
      </div>

      <div className="login-page__image">image</div>
    </div>
  );
}
