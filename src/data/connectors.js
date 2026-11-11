import { fetchSourcePayload } from './adapters'

export async function fetchSourceData(sourceKey) {
  return fetchSourcePayload(sourceKey)
}

export async function loadAllSources() {
  // We fetch these in parallel because the overview screen only needs the combined state,
  // and the user should not wait on one source to finish before the others load.
  const [teamBuildr, appleHealth, veSync] = await Promise.all([
    fetchSourceData('teamBuildr'),
    fetchSourceData('appleHealth'),
    fetchSourceData('veSync'),
  ])

  return {
    teamBuildr,
    appleHealth,
    veSync,
  }
}

export function deriveIntegrationSummary(dataSources) {
  // Keeping the summary slim is useful here: the UI only needs to know whether a source is
  // connected and how recently it synced, not the entire raw JSON payload.
  return {
    teamBuildr: {
      connected: Boolean(dataSources?.teamBuildr),
      records: dataSources?.teamBuildr?.records?.length ?? 0,
      lastSync: dataSources?.teamBuildr?.lastSync ?? 'Not synced',
    },
    appleHealth: {
      connected: Boolean(dataSources?.appleHealth),
      records: dataSources?.appleHealth?.records?.length ?? 0,
      lastSync: dataSources?.appleHealth?.lastSync ?? 'Not synced',
    },
    veSync: {
      connected: Boolean(dataSources?.veSync),
      records: dataSources?.veSync?.records?.length ?? 0,
      lastSync: dataSources?.veSync?.lastSync ?? 'Not synced',
    },
  }
}
