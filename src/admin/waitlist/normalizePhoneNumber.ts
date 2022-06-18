export function normalizePhoneNumber(phone: string) {
  return phone
    .replace(/\D/g, '')
    .replace(/^00/, '')
    .replace(/^0(?!0)/, '43');
}
