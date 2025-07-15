export function backendUrl(path: string) {
  return `${import.meta.env.VITE_BACKEND_DOMAIN}/${path}`
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}
