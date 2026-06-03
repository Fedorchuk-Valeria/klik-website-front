import HeaderAuth from "@/src/components/ui/HeaderPlatformAuth/HeaderPlatformAuth";;
import HeaderPlatformLogo from "@/src/components/ui/HeaderPlatform/HeaderPlatformLogo";

type HeaderPlatformProps = {
  variant?: "dark" | "light";
  showAuthControls?: boolean;
};

export default async function HeaderPlatform({
   variant = "dark",
   showAuthControls = true,
   }: HeaderPlatformProps) {
  const logo = variant === "light" ? "light" : "dark";

  return (
    <header className="header">
      <div className="header__container">
        <div className={`header__wrapper ${variant}`}>
          <div className="header__top header__row">
            <div className="header__left">
              <div className="header__brand">
                <HeaderPlatformLogo variant={variant} />

                <div className="header__logo-text">
                  Дополнительное
                  <br />
                  IT-образование для детей
                </div>
              </div>
            </div>

            {showAuthControls && (
            <div className="header__right">
              <HeaderAuth />
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
