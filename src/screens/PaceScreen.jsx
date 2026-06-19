import { GOAL, TOTAL_DAYS, getDayOfYear, dateToKey } from '../utils.js'
import './PaceScreen.css'

function getWeekNumber(date) {
  const start = new Date(2026, 0, 1)
  const diff = date - start
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
}

export default function PaceScreen({ totals, entries }) {
  const dayOfYear = getDayOfYear()
  const daysLeft = TOTAL_DAYS - dayOfYear
  const milesLeft = Math.max(0, GOAL - totals.all)
  const dailyNeeded = daysLeft > 0 ? milesLeft / daysLeft : 0
  const expectedByNow = (dayOfYear / TOTAL_DAYS) * GOAL
  const diff = totals.all - expectedByNow
  const ahead = diff >= 0
  const pctOff = Math.min(Math.abs(diff) / 50, 1)
  const avgPerWeek = dayOfYear > 0 ? (totals.all / dayOfYear) * 7 : 0

  const currentWeek = getWeekNumber(new Date())
  const weeklyData = []
  for (let w = Math.max(0, currentWeek - 7); w <= currentWeek; w++) {
    let weekTotal = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date(2026, 0, 1 + w * 7 + d)
      if (date.getFullYear() !== 2026) continue
      const e = entries[dateToKey(date)]
      if (e) weekTotal += e.walk + e.bike + e.swim
    }
    weeklyData.push({ week: w + 1, total: weekTotal })
  }
  const maxWeek = Math.max(...weeklyData.map(w => w.total), 1)

  return (
    <div className="pace-screen">
      <div className="pace-panel yellow-border">
        <div className="pace-label">DAILY MILES NEEDED</div>
        <div className="pace-value yellow">{dailyNeeded.toFixed(2)}</div>
        <div className="pace-sub">mi/day to finish by Dec 31</div>
      </div>

      <div className="pace-panel blue-border">
        <div className="pace-label">AVG MILES / WEEK</div>
        <div className="pace-value blue">{avgPerWeek.toFixed(1)}</div>
      </div>

      <div className="pace-panel">
        <div className="pace-label">{ahead ? 'AHEAD' : 'BEHIND'} BY {Math.abs(diff).toFixed(1)} MI</div>
        <div className="ahead-behind-bar">
          <div className="ab-center" />
          {ahead ? (
            <div className="ab-fill ahead" style={{ width: `${pctOff * 50}%`, right: '50%' }} />
          ) : (
            <div className="ab-fill behind" style={{ width: `${pctOff * 50}%`, left: '50%' }} />
          )}
        </div>
        <div className="ab-labels">
          <span className="green">AHEAD</span>
          <span className="red">BEHIND</span>
        </div>
      </div>

      <div className="pace-panel">
        <div className="pace-label">WEEKLY MILES (LAST 8 WKS)</div>
        <div className="weekly-chart">
          {weeklyData.map((w, i) => (
            <div key={i} className="week-col">
              <div className="week-bar-wrap">
                <div
                  className="week-bar"
                  style={{ height: `${(w.total / maxWeek) * 100}%` }}
                />
              </div>
              <span className="week-label">W{w.week}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
