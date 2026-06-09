import { useEffect } from "react";

const useHideBodyScroll = (isHide: boolean, _isHideMobile = true) => {
  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];

    // for fix tochmove at safari
    let cleanupTouchMove = () => {};

    if (typeof document !== "undefined") {
      if (_isHideMobile) {
        html.style.overflowY = isHide ? "hidden" : "initial";

        if (isHide) {
          const preventDefault = (event: Event) => {
            if (event.target instanceof HTMLElement && event.target.closest("dialog[open]")) {
              return;
            }
            event.preventDefault();
          };

          document.addEventListener("touchmove", preventDefault, {
            passive: false,
          });
          document.addEventListener("wheel", preventDefault, {
            passive: false,
          });

          cleanupTouchMove = () => {
            document.removeEventListener("touchmove", preventDefault);
            document.removeEventListener("wheel", preventDefault);
          };
        } else {
          cleanupTouchMove();
        }
      } else {
        html.style.overflowY = "initial";
        cleanupTouchMove();
      }
    }

    return () => {
      html.style.overflowY = "initial";
      cleanupTouchMove();
    };
  }, [isHide, _isHideMobile]);
};

export default useHideBodyScroll;
