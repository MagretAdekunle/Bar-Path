// LiftsPage keeps the lift-specific experience isolated so it can grow with more
// movement breakdowns, charting, or coaching notes without crowding the app shell.
const BAR_WEIGHT = 20

const plateTypes = [
  { weight: 25, fractionalWeight: 2.5, color: 'red', diameter: 92, thickness: 18 },
  { weight: 20, fractionalWeight: 2, color: 'blue', diameter: 84, thickness: 16 },
  { weight: 15, fractionalWeight: 1.5, color: 'yellow', diameter: 76, thickness: 14 },
  { weight: 10, fractionalWeight: 1, color: 'green', diameter: 68, thickness: 12 },
  { weight: 5, fractionalWeight: 0.5, color: 'white', diameter: 58, thickness: 10 },
]

const getPlatesPerSide = (totalWeight) => {
  let remainingWeight = Math.round(Math.max(0, (totalWeight - BAR_WEIGHT) / 2) * 10)
  const plates = []
  const availablePlates = plateTypes
    .flatMap((plate) => [
      { ...plate, loadedWeight: plate.weight },
      {
        ...plate,
        loadedWeight: plate.fractionalWeight,
        diameter: Math.max(30, Math.round(plate.diameter * 0.52)),
        thickness: Math.max(6, Math.round(plate.thickness * 0.55)),
      },
    ])
    .sort((a, b) => b.loadedWeight - a.loadedWeight)

  for (const plate of availablePlates) {
    const plateWeight = plate.loadedWeight * 10

    while (remainingWeight >= plateWeight) {
      plates.push({ ...plate, key: `${plate.color}-${plate.loadedWeight}-${plates.length}` })
      remainingWeight -= plateWeight
    }
  }

  return plates
}

const LiftsPage = ({ liftCards, selectedLift, setSelectedLift, selectedLiftMeta }) => {
  const platesPerSide = getPlatesPerSide(selectedLiftMeta.value)
  const perSideWeight = Math.max(0, (selectedLiftMeta.value - BAR_WEIGHT) / 2)
  const plateBreakdown = platesPerSide.map((plate) => plate.loadedWeight).join(' + ')

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

        <div className="lift-animation" role="img" aria-label={`${selectedLiftMeta.label} animation with a ${selectedLiftMeta.value} kilogram barbell`}>
          <div className="lift-barbell" aria-hidden="true">
            <span className="barbell-shaft" />
            <div className="barbell-plates left">
              {platesPerSide.map((plate) => (
                <span
                  key={`left-${plate.key}`}
                  className={`barbell-plate ${plate.color}`}
                  style={{ height: `${plate.diameter}px`, width: `${plate.thickness}px` }}
                />
              ))}
            </div>
            <div className="barbell-plates right">
              {platesPerSide.map((plate) => (
                <span
                  key={`right-${plate.key}`}
                  className={`barbell-plate ${plate.color}`}
                  style={{ height: `${plate.diameter}px`, width: `${plate.thickness}px` }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="barbell-loadout">
          {selectedLiftMeta.value} kg total · 20 kg bar + {perSideWeight} kg per side
          {plateBreakdown && ` (${plateBreakdown} kg plates)`}
        </p>
        <div className="plate-legend" aria-label="Competition plate color key">
          {plateTypes.map((plate) => (
            <div className="plate-key" key={plate.color}>
              <span className="plate-key-discs" aria-hidden="true">
                <span
                  className={`plate-key-disc ${plate.color}`}
                  style={{ height: `${Math.max(15, Math.round(plate.diameter / 4))}px`, width: `${Math.max(15, Math.round(plate.diameter / 4))}px` }}
                />
                <span
                  className={`plate-key-disc fractional ${plate.color}`}
                  style={{ height: `${Math.max(9, Math.round(plate.diameter / 7))}px`, width: `${Math.max(9, Math.round(plate.diameter / 7))}px` }}
                />
              </span>
              <span className="plate-key-label">
                <strong>{plate.weight} kg</strong>
                <small>Change plate {plate.fractionalWeight} kg</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LiftsPage
