// LiftsPage keeps the lift-specific experience isolated so it can grow with more
// movement breakdowns, charting, or coaching notes without crowding the app shell.
const LiftsPage = ({ liftCards, selectedLift, setSelectedLift, selectedLiftMeta }) => {
  return (
    <section className="panel full-width-panel lift-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Competition lifts</p>
          <h3>Current performance profile</h3>
        </div>
      </div>

      <div className="lift-grid">
        {liftCards.map((lift) => (
          <button
            key={lift.key}
            type="button"
            className={selectedLift === lift.key ? `lift-card ${lift.colors} active` : `lift-card ${lift.colors}`}
            onClick={() => setSelectedLift(lift.key)}
          >
            <p>{lift.label}</p>
            <h3>{lift.value} kg</h3>
            <span>{lift.percent}% of Texas record</span>
          </button>
        ))}
      </div>

      <div className="performance-figure">
        <div className="figure-header">
          <div>
            <p className="eyebrow">Selected lift</p>
            <h3>{selectedLiftMeta.label}</h3>
          </div>
          <span className="team-tag">{selectedLiftMeta.note}</span>
        </div>

        <div className={`stick-figure ${selectedLift}`} aria-label={`${selectedLiftMeta.label} movement animation`}>
          <div className="figure-head" />
          <div className="figure-body" />
          <div className="figure-arm arm-left" />
          <div className="figure-arm arm-right" />
          <div className="figure-leg leg-left" />
          <div className="figure-leg leg-right" />
        </div>
      </div>
    </section>
  )
}

export default LiftsPage
