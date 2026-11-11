// OverviewPage contains the front-screen dashboard cards and trend widgets.
// This keeps the landing screen easier to scan and gives the main App component
// a clearer responsibility: shell layout + state management.
const OverviewPage = ({
  profile,
  settings,
  sourceSummary,
  readinessScore,
  weightDifference,
  snatchPercent,
  cleanJerkPercent,
  totalPercent,
  texasRecords,
}) => {
  const currentMaxTotal = profile.snatch + profile.cleanJerk

  return (
    <>
      <section className="summary-grid">
        <article className="stat-card accent">
          <p>Current max</p>
          <h3>{currentMaxTotal} kg</h3>
          <span>Total by combined lift</span>
        </article>

        <article className="stat-card">
          <p>Goal weight</p>
          <h3>{profile.goalWeight} kg</h3>
          <span>{Math.abs(weightDifference).toFixed(1)} kg to target</span>
        </article>

        <article className="stat-card">
          <p>Competition readiness</p>
          <h3>{readinessScore}%</h3>
          <span>Based on load + body comp</span>
        </article>

        <article className="stat-card">
          <p>Next event</p>
          <h3>{new Date(profile.competitionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
          <span>{profile.weightClass} class</span>
        </article>
      </section>

      <section className="two-column-grid">
        {settings.showComparison && (
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Texas record comparison</p>
                <h3>Current max vs. women’s 71kg record</h3>
              </div>
              <span className="team-tag">TX standard</span>
            </div>

            <div className="record-list">
              <div className="record-row">
                <div className="record-meta">
                  <span>Snatch</span>
                  <strong>{profile.snatch} kg</strong>
                </div>
                <div className="record-bar-track">
                  <div className="record-bar fill-snatch" style={{ width: `${snatchPercent}%` }} />
                </div>
                <div className="record-target">{texasRecords.snatch} kg</div>
              </div>

              <div className="record-row">
                <div className="record-meta">
                  <span>Clean &amp; Jerk</span>
                  <strong>{profile.cleanJerk} kg</strong>
                </div>
                <div className="record-bar-track">
                  <div className="record-bar fill-cj" style={{ width: `${cleanJerkPercent}%` }} />
                </div>
                <div className="record-target">{texasRecords.cleanJerk} kg</div>
              </div>

              <div className="record-row total-row">
                <div className="record-meta">
                  <span>Total</span>
                  <strong>{profile.total} kg</strong>
                </div>
                <div className="record-bar-track">
                  <div className="record-bar fill-total" style={{ width: `${totalPercent}%` }} />
                </div>
                <div className="record-target">{texasRecords.total} kg</div>
              </div>
            </div>
          </article>
        )}

        {settings.showReadiness && (
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Competition readiness</p>
                <h3>Stage of peak performance</h3>
              </div>
              <span className="score-badge">{readinessScore}%</span>
            </div>

            <div className="radial-wrap">
              <div className="radial-chart" style={{ '--progress': `${readinessScore}%` }}>
                <span>{readinessScore}%</span>
              </div>
              <ul className="readiness-list">
                <li>
                  <span className="dot green" />
                  Technique rating: 87%
                </li>
                <li>
                  <span className="dot amber" />
                  Recovery: 83%
                </li>
                <li>
                  <span className="dot blue" />
                  Strength trend: +6.4%
                </li>
              </ul>
            </div>
          </article>
        )}
      </section>

      <section className="two-column-grid lower-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Cut progress</p>
              <h3>Goal weight tracking</h3>
            </div>
            <span className="team-tag muted">Target {profile.goalWeight} kg</span>
          </div>

          <div className="weight-progress">
            <div className="weight-scale">
              <span style={{ left: `${Math.max(10, (profile.goalWeight / 90) * 100)}%` }}>Goal</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, ((profile.currentWeight - 65) / (profile.goalWeight - 65)) * 100)}%` }}
              />
            </div>
            <div className="weight-meta">
              <strong>{profile.currentWeight} kg</strong>
              <span>{Math.abs(weightDifference).toFixed(1)} kg remaining</span>
            </div>
          </div>
        </article>

        {settings.showRecovery && (
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Recovery</p>
                <h3>Sleep + readiness trend</h3>
              </div>
            </div>

            <div className="mini-chart" aria-label="Recovery trend chart">
              {[89, 92, 81, 85, 90, 87, 83].map((value, index) => (
                <span key={value + index} style={{ height: `${value}%` }} />
              ))}
            </div>
          </article>
        )}
      </section>

      {settings.showIntegrations && (
        <section className="panel full-width-panel compact-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Smart integrations</p>
              <h3>Connected data sources</h3>
            </div>
          </div>

          <div className="integration-list">
            {Object.entries(sourceSummary).map(([key, item]) => (
              <div key={key} className={item.connected ? 'connection-pill active' : 'connection-pill'}>
                <span className={`dot ${key === 'teamBuildr' ? 'green' : key === 'appleHealth' ? 'blue' : 'amber'}`} />
                {key === 'teamBuildr' ? 'TeamBuildr' : key === 'appleHealth' ? 'Apple Health' : 'VeSync'}
                {item.connected ? ` · Synced ${item.lastSync}` : ' · Not connected'}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default OverviewPage
