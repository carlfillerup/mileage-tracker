export const GOAL = 739
export const YEAR = 2026
export const TOTAL_DAYS = 365

export const WAYPOINTS = [
  { x: 291, y: 46, label: 'START: HOME / LAYTON, UT', color: '#4ade80', dotSize: 5 },
  { x: 298, y: 65, label: 'Provo', color: '#38bdf8', dotSize: 3 },
  { x: 284, y: 82, label: 'Nephi', color: '#38bdf8', dotSize: 2.5, stroke: true },
  { x: 272, y: 98, label: 'Fillmore', color: '#38bdf8', dotSize: 2.5, stroke: true },
  { x: 264, y: 114, label: 'Beaver', color: '#38bdf8', dotSize: 2.5, stroke: true },
  { x: 258, y: 126, label: 'Cedar City', color: '#38bdf8', dotSize: 2.5, stroke: true },
  { x: 255, y: 139, label: 'St. George', color: '#38bdf8', dotSize: 3 },
  { x: 220, y: 161, label: 'Las Vegas', color: '#38bdf8', dotSize: 4 },
  { x: 200, y: 183, label: 'Baker', color: '#38bdf8', dotSize: 3 },
  { x: 178, y: 191, label: 'Barstow', color: '#38bdf8', dotSize: 3 },
  { x: 172, y: 210, label: 'San Bernardino', color: '#38bdf8', dotSize: 3 },
  { x: 165, y: 226, label: 'GOAL: SAN CLEMENTE, CA', color: '#fbbf24', dotSize: 5 },
]

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getAllDates() {
  const dates = []
  const d = new Date(YEAR, 0, 1)
  while (d.getFullYear() === YEAR) {
    dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export function formatDate(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
}

export function dateToKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getSegmentLengths() {
  const lengths = []
  for (let i = 1; i < WAYPOINTS.length; i++) {
    const dx = WAYPOINTS[i].x - WAYPOINTS[i - 1].x
    const dy = WAYPOINTS[i].y - WAYPOINTS[i - 1].y
    lengths.push(Math.sqrt(dx * dx + dy * dy))
  }
  return lengths
}

export function getTotalRouteLength() {
  return getSegmentLengths().reduce((a, b) => a + b, 0)
}

export function getPositionOnRoute(fraction) {
  const lengths = getSegmentLengths()
  const total = lengths.reduce((a, b) => a + b, 0)
  let target = fraction * total
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) {
      const t = target / lengths[i]
      return {
        x: WAYPOINTS[i].x + (WAYPOINTS[i + 1].x - WAYPOINTS[i].x) * t,
        y: WAYPOINTS[i].y + (WAYPOINTS[i + 1].y - WAYPOINTS[i].y) * t,
      }
    }
    target -= lengths[i]
  }
  return { x: WAYPOINTS[WAYPOINTS.length - 1].x, y: WAYPOINTS[WAYPOINTS.length - 1].y }
}

export function getRoutePathD() {
  return WAYPOINTS.map((wp, i) => `${i === 0 ? 'M' : 'L'}${wp.x},${wp.y}`).join(' ')
}
