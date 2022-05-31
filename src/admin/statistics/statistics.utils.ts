export function sumValues(value: { [p: string]: number }) {
  return Object.values(value).reduce((a, b) => a + b, 0);
}
