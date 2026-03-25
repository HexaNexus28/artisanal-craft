export function buildWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`;
}
