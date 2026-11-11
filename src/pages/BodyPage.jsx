// BodyPage holds the body composition and trend cards. This keeps the athlete's
// physique data separate from the lifting and settings screens.
const BodyPage = ({ settings, weeklyTrend, sourceSummary }) => {
  return (
    <section className="two-column-grid">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Body composition</p>
            <h3>Weekly scale trend</h3>
          </div>
        </div>

        <div className="body-trend" aria-label="Body weight chart">
          {weeklyTrend.map((value, index) => (
            <div key={value + index} className="bar-group">
              <span className="bar" style={{ height: `${(value / 76) * 100}%` }} />
              <small>{index + 1}</small>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Smart integrations</p>
            <h3>Connected data sources</h3>
          </div>
        </div>

        {settings.showIntegrations && (
          <div className="integration-list">
            {Object.entries(sourceSummary).map(([key, item]) => (
              <div key={key} className={item.connected ? 'connection-pill active' : 'connection-pill'}>
                <span className={`dot ${key === 'teamBuildr' ? 'green' : key === 'appleHealth' ? 'blue' : 'amber'}`} />
                {key === 'teamBuildr' ? 'TeamBuildr' : key === 'appleHealth' ? 'Apple Health' : 'VeSync'}
                {item.connected ? ` · Synced ${item.lastSync}` : ' · Not connected'}
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

export default BodyPage
