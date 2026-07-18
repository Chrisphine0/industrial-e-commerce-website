export async function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include', // Always send cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}