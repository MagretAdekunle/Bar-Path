const env = import.meta.env

export function getSourceConfig(sourceKey) {
  const config = {
    teamBuildr: {
      localUrl: '/data/teambuildr.json',
      apiUrl: env.VITE_TEAMBUILDR_API_URL || 'http://localhost:3001/api/teambuildr',
      token: env.VITE_TEAMBUILDR_TOKEN,
      // The app expects a consistent shape after the fetch, so the upstream payload is
      // normalized into a simple record array and a timestamp rather than leaking source-specific fields.
      normalize: (payload) => ({
        lastSync: payload?.lastSync ?? new Date().toISOString(),
        records: Array.isArray(payload?.records) ? payload.records : [],
      }),
    },
    appleHealth: {
      localUrl: '/data/apple-health.json',
      apiUrl: env.VITE_APPLE_HEALTH_API_URL || 'http://localhost:3001/api/apple-health',
      token: env.VITE_APPLE_HEALTH_TOKEN,
      normalize: (payload) => ({
        lastSync: payload?.lastSync ?? new Date().toISOString(),
        records: Array.isArray(payload?.records) ? payload.records : [],
      }),
    },
    veSync: {
      localUrl: '/data/vesync.json',
      apiUrl: env.VITE_VESYNC_API_URL || 'http://localhost:3001/api/vesync',
      token: env.VITE_VESYNC_TOKEN,
      normalize: (payload) => ({
        lastSync: payload?.lastSync ?? new Date().toISOString(),
        records: Array.isArray(payload?.records) ? payload.records : [],
      }),
    },
  }

  return config[sourceKey]
}

async function fetchJson(url, token) {
  const headers = { Accept: 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`)
  }

  return response.json()
}

export async function fetchSourcePayload(sourceKey) {
  const config = getSourceConfig(sourceKey)

  if (!config) {
    throw new Error(`Unknown source: ${sourceKey}`)
  }

  // The app should work without real credentials during local development, so the adapter
  // tries the live endpoint first and then quietly falls back to the bundled fixture if needed.
  if (config.apiUrl) {
    try {
      const payload = await fetchJson(config.apiUrl, config.token)
      return config.normalize(payload)
    } catch (error) {
      console.warn(`Falling back to local fixture for ${sourceKey}:`, error)
    }
  }

  const fallback = await fetchJson(config.localUrl)
  return config.normalize(fallback)
}
