export function sanitizeString(str: string) {
  str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, ' ')
  return str.trim()
}
