export function generateRandomId(): string {
  return Date.now() + Math.random().toString(36)
}
