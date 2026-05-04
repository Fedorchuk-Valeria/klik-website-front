/** Google Consent Mode v2: значения для gtag('consent', 'update', …) после принятия политики. */
export const GA_CONSENT_UPDATE_WHEN_ACCEPTED = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

export function applyGtagConsentWhenAccepted(): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", { ...GA_CONSENT_UPDATE_WHEN_ACCEPTED });
}
