type ScrollToTopOptions = {
  behavior?: ScrollBehavior;
};

export function scrollToTop(options: ScrollToTopOptions = {}): void {
  const behavior = options.behavior ?? "smooth";
  const scrollOptions: ScrollToOptions = { top: 0, left: 0, behavior };

  window.scrollTo(scrollOptions);
  document.documentElement.scrollTo(scrollOptions);
  document.body.scrollTo(scrollOptions);
}
