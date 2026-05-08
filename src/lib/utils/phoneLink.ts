export function phoneToLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits}`;
}
