import { getToken, clearSession } from './session'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const authToken = token || getToken()
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    clearSession()
    window.location.href = '/'
    throw new Error('Session expired. Please login again.')
  }

  if (!response.ok) {
    const errorText = await response.text()
    // try formatting JSON error if possible
    try {
        const jsonErr = JSON.parse(errorText)
        throw new Error(jsonErr.message || errorText)
    } catch {
        throw new Error(errorText || `Request failed: ${response.status}`)
    }
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
