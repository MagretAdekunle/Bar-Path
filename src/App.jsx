import { useEffect, useMemo, useState } from 'react'
import OverviewPage from './pages/OverviewPage'
import LiftsPage from './pages/LiftsPage'
import BodyPage from './pages/BodyPage'
import SettingsPage from './pages/SettingsPage'
import { deriveIntegrationSummary, loadAllSources } from './data/connectors'
import './App.css'

const texasRecords = {
  snatch: 127,
  cleanJerk: 158,
  total: 285,
}

// Defaults keep the dashboard usable immediately before live source data is loaded.
const initialProfile = {
  currentWeight: 74.2,
  goalWeight: 71,
  weightClass: '71 kg',
  competitionDate: '2027-04-15',
  snatch: 118,
  cleanJerk: 146,
  total: 264,
}

const initialSettings = {
  showBodyWeight: true,
  showReadiness: true,
  showComparison: true,
  showRecovery: true,
  showIntegrations: true,
}

const weeklyTrend = [72.7, 73.8, 74.1, 73.6, 73.2, 72.8, 74.2]
const recoveryScores = [89, 92, 81, 85, 90, 87, 83]

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedLift, setSelectedLift] = useState('snatch')
  const [profile, setProfile] = useState(initialProfile)
  const [settings, setSettings] = useState(initialSettings)

  // Keep the UI summary lightweight; full data stays in source adapters.
  const [sourceSummary, setSourceSummary] = useState({
    teamBuildr: { connected: false, records: 0, lastSync: 'Not synced' },
    appleHealth: { connected: false, records: 0, lastSync: 'Not synced' },
    veSync: { connected: false, records: 0, lastSync: 'Not synced' },
  })

  useEffect(() => {
    let isMounted = true

    const hydrateData = async () => {
      try {
        const dataSources = await loadAllSources()

        if (!isMounted) {
          return
        }

        const teamRecords = dataSources.teamBuildr?.records ?? []
        const snatchRecord = teamRecords.find((record) => record.name === 'Snatch')
        const cleanJerkRecord = teamRecords.find((record) => record.name === 'Clean & Jerk')
        const bodyWeightRecord = dataSources.veSync?.records?.find((record) => record.name === 'Body weight')

        setSourceSummary(deriveIntegrationSummary(dataSources))

        setProfile((prev) => ({
          ...prev,
          snatch: snatchRecord ? Number(snatchRecord.value) : prev.snatch,
          cleanJerk: cleanJerkRecord ? Number(cleanJerkRecord.value) : prev.cleanJerk,
          currentWeight: bodyWeightRecord ? Number(bodyWeightRecord.value) : prev.currentWeight,
          total: ((snatchRecord ? Number(snatchRecord.value) : prev.snatch) + (cleanJerkRecord ? Number(cleanJerkRecord.value) : prev.cleanJerk)),
        }))
      } catch (error) {
        console.error('Failed to load integration data:', error)
      }
    }

    hydrateData()

    return () => {
      isMounted = false
    }
  }, [])

  const weightDifference = useMemo(
    () => Number((profile.currentWeight - profile.goalWeight).toFixed(1)),
    [profile.currentWeight, profile.goalWeight],
  )

  const readinessScore = useMemo(() => {
    const liftRatio = ((profile.snatch / texasRecords.snatch) + (profile.cleanJerk / texasRecords.cleanJerk)) / 2
    const leanScore = Math.max(0, 100 - Math.abs(weightDifference) * 6)
    return Math.min(99, Math.max(55, Math.round((liftRatio * 55) + (leanScore * 0.45))))
  }, [profile.cleanJerk, profile.snatch, weightDifference])

  // Chart percentages are capped so the visual bars stay readable and do not exceed
  // the reference standard by accident.
  const snatchPercent = Math.min(100, Math.round((profile.snatch / texasRecords.snatch) * 100))
  const cleanJerkPercent = Math.min(100, Math.round((profile.cleanJerk / texasRecords.cleanJerk) * 100))
  const totalPercent = Math.min(100, Math.round((profile.total / texasRecords.total) * 100))

  const handleProfileChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: key === 'weightClass' || key === 'competitionDate' ? value : Number(value),
    }))
  }

  const toggleWidget = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const liftCards = [
    {
      key: 'snatch',
      label: 'Snatch',
      value: profile.snatch,
      percent: snatchPercent,
      note: 'Explosive pull',
      colors: 'highlight',
    },
    {
      key: 'cleanJerk',
      label: 'Clean & Jerk',
      value: profile.cleanJerk,
      percent: cleanJerkPercent,
      note: 'Drive and catch',
      colors: 'highlight alt',
    },
    {
      key: 'frontSquat',
      label: 'Front squat',
      value: 135,
      percent: 78,
      note: 'Stability under load',
      colors: '',
    },
    {
      key: 'backSquat',
      label: 'Back squat',
      value: 170,
      percent: 82,
      note: 'Base strength',
      colors: '',
    },
  ]

  const selectedLiftMeta = liftCards.find((lift) => lift.key === selectedLift) ?? liftCards[0]

  return (
    <div className={sidebarCollapsed ? 'app-shell collapsed' : 'app-shell'}>
      <aside className={sidebarCollapsed ? 'sidebar collapsed' : 'sidebar'}>
        <div className="brand-block">
          <div className="brand-mark">B</div>
          <div>
            <p className="eyebrow">training dashboard</p>
            <h2>BarPath</h2>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {['overview', 'lifts', 'body', 'settings'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'lifts' && 'Lifts'}
              {tab === 'body' && 'Body'}
              {tab === 'settings' && 'Settings'}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">Athlete profile</p>
            <h1>Women’s 71kg pathway</h1>
          </div>
          <div className="header-actions">
            <div className="pill success">Cut mode</div>
            <button type="button" className="ghost-button">
              Export report
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <OverviewPage
            profile={profile}
            settings={settings}
            sourceSummary={sourceSummary}
            readinessScore={readinessScore}
            weightDifference={weightDifference}
            snatchPercent={snatchPercent}
            cleanJerkPercent={cleanJerkPercent}
            totalPercent={totalPercent}
            texasRecords={texasRecords}
          />
        )}

        {activeTab === 'lifts' && (
          <LiftsPage
            liftCards={liftCards}
            selectedLift={selectedLift}
            setSelectedLift={setSelectedLift}
            selectedLiftMeta={selectedLiftMeta}
          />
        )}

        {activeTab === 'body' && (
          <BodyPage
            settings={settings}
            weeklyTrend={weeklyTrend}
            sourceSummary={sourceSummary}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            profile={profile}
            settings={settings}
            handleProfileChange={handleProfileChange}
            toggleWidget={toggleWidget}
          />
        )}
      </main>
    </div>
  )
}

export default App
