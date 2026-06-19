import { dateToKey, formatDate } from '../utils.js'
import './SummaryScreen.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function SummaryScreen({ totals, entries }) {
  const monthlyMiles = MONTHS.map((_, m) => {
    let sum = 0
    const d = new Date(2026, m, 1)
    while (d.getMonth() === m) {
      const e = entries[dateToKey(d)]
      if (e) sum += e.walk + e.bike + e.swim
      d.setDate(d.getDate() + 1)
    }
    return sum
  })

  let bestDay = { date: null, total: 0 }
  let activeDays = 0
  Object.entries(entries).forEach(([key, e]) => {
    const t = e.walk + e.bike + e.swim
    if (t > 0) {
      activeDays++
      if (t > bestDay.total) {
        bestDay = { date: key, total: t }
      }
    }
  })

  return (
    <div className="summary-screen">
      <div className="summary-panel">
        <div className="summary-label">MONTHLY MILES</div>
        <div className="month-grid">
          {MONTHS.map((name, i) => (
            <div key={name} className={`month-cell ${monthlyMiles[i] === 0 ? 'zero' : ''}`}>
              <span className="month-name">{name}</span>
              <span className="month-val">{monthlyMiles[i].toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-panel">
        <div className="summary-label">ACTIVITY BREAKDOWN</div>
        <div className="breakdown-row">
          <div className="breakdown-item walk">WALK: {totals.walk.toFixed(1)}</div>
          <div className="breakdown-item bike">BIKE: {totals.bike.toFixed(1)}</div>
          <div className="breakdown-item swim">SWIM: {totals.swim.toFixed(1)}</div>
        </div>
      </div>

      <div className="summary-row">
        <div className="summary-panel small">
          <div className="summary-label">BEST DAY</div>
          <div className="summary-big yellow">
            {bestDay.total > 0 ? bestDay.total.toFixed(1) : '--'}
          </div>
          <div className="summary-sub">
            {bestDay.date ? formatDate(new Date(bestDay.date + 'T00:00:00')) : 'N/A'}
          </div>
        </div>
        <div className="summary-panel small">
          <div className="summary-label">ACTIVE DAYS</div>
          <div className="summary-big green">{activeDays}</div>
        </div>
      </div>
    </div>
  )
}
