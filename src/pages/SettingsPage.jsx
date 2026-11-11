// SettingsPage is intentionally kept as a single form area so the athlete can
// adjust profile data and front-screen visibility from one place.
const SettingsPage = ({ profile, settings, handleProfileChange, toggleWidget }) => {
  return (
    <section className="panel full-width-panel settings-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Dashboard controls</p>
          <h3>Front-page content and athlete settings</h3>
        </div>
      </div>

      <div className="settings-grid">
        <label className="field">
          <span>Current weight class</span>
          <input
            type="text"
            value={profile.weightClass}
            onChange={(event) => handleProfileChange('weightClass', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Goal weight</span>
          <input
            type="number"
            value={profile.goalWeight}
            min="60"
            max="90"
            step="0.1"
            onChange={(event) => handleProfileChange('goalWeight', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Current bodyweight</span>
          <input
            type="number"
            value={profile.currentWeight}
            min="60"
            max="90"
            step="0.1"
            onChange={(event) => handleProfileChange('currentWeight', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Competition date</span>
          <input
            type="date"
            value={profile.competitionDate}
            onChange={(event) => handleProfileChange('competitionDate', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Snatch max</span>
          <input
            type="number"
            value={profile.snatch}
            min="50"
            max="180"
            onChange={(event) => handleProfileChange('snatch', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Clean &amp; Jerk max</span>
          <input
            type="number"
            value={profile.cleanJerk}
            min="60"
            max="200"
            onChange={(event) => handleProfileChange('cleanJerk', event.target.value)}
          />
        </label>
      </div>

      <div className="toggle-group">
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} className="toggle-row">
            <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
            <button
              type="button"
              className={value ? 'toggle active' : 'toggle'}
              onClick={() => toggleWidget(key)}
              aria-pressed={value}
            >
              <span />
            </button>
          </label>
        ))}
      </div>
    </section>
  )
}

export default SettingsPage
