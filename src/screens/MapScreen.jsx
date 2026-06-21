import { GOAL, WAYPOINTS, getPositionOnRoute, getRoutePathD, getTotalRouteLength } from '../utils.js'
import './MapScreen.css'

export default function MapScreen({ totals }) {
  const logged = totals.all
  const remaining = Math.max(0, GOAL - logged)
  const pct = Math.min(1, logged / GOAL)
  const heroPos = getPositionOnRoute(pct)
  const routeD = getRoutePathD()
  const routeLen = getTotalRouteLength()

  return (
    <div className="map-screen">
      <div className="stat-row">
        <div className="stat-box" style={{ borderColor: 'var(--green)' }}>
          <div className="stat-label" style={{ color: 'var(--green)' }}>LOGGED</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{logged.toFixed(1)}</div>
        </div>
        <div className="stat-box" style={{ borderColor: 'var(--yellow)' }}>
          <div className="stat-label" style={{ color: 'var(--yellow)' }}>REMAINING</div>
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>{remaining.toFixed(1)}</div>
        </div>
        <div className="stat-box" style={{ borderColor: 'var(--blue)' }}>
          <div className="stat-label" style={{ color: 'var(--blue)' }}>COMPLETE</div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{(pct * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="xp-bar-container">
        <div className="xp-bar-fill" style={{ width: `${pct * 100}%` }} />
        <span className="xp-bar-text">{logged.toFixed(1)} / {GOAL} mi</span>
      </div>

      <svg className="map-svg" viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2744" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="380" height="260" fill="url(#grid)" />

        {/* States */}
        <polygon points="245,24 357,24 357,142 245,142" fill="#0f2040" stroke="#4a7ab5" strokeWidth="1.5" />
        <polygon points="112,24 245,24 245,189 112,94" fill="#0f2040" stroke="#4a7ab5" strokeWidth="1.5" />
        <polygon points="18,24 112,24 112,94 245,189 230,243 177,248 175,243 166,227 146,210 101,200 69,151 58,122 27,107 22,71 18,47" fill="#0f2040" stroke="#4a7ab5" strokeWidth="1.5" />

        {/* State labels */}
        <text x="301" y="88" fill="#e2e8f0" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">UTAH</text>
        <text x="175" y="95" fill="#e2e8f0" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">NEVADA</text>
        <text x="68" y="158" fill="#e2e8f0" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">CALIFORNIA</text>

        {/* Dashed route line */}
        <path d={routeD} fill="none" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="6,3" />

        {/* Green progress overlay */}
        <path
          d={routeD}
          fill="none"
          stroke="#4ade80"
          strokeWidth="4"
          strokeDasharray={routeLen}
          strokeDashoffset={routeLen - routeLen * pct}
          strokeLinecap="round"
        />

        {/* Waypoint dots and labels */}
        {WAYPOINTS.map((wp, i) => (
          <g key={i}>
            {wp.stroke ? (
              <circle cx={wp.x} cy={wp.y} r={wp.dotSize} fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
            ) : (
              <circle cx={wp.x} cy={wp.y} r={wp.dotSize} fill={wp.color} />
            )}
            <text
              x={wp.x + 6}
              y={wp.y + 3}
              fill={wp.color}
              fontSize={wp.stroke ? '3.5' : '4'}
              fontFamily="'Press Start 2P'"
            >
              {wp.label}
            </text>
          </g>
        ))}

        {/* Hero sprite */}
        <g transform={`translate(${heroPos.x - 6}, ${heroPos.y - 14})`}>
          {/* Head */}
          <rect x="3" y="0" width="6" height="5" fill="#fbbf24" />
          {/* Shirt */}
          <rect x="2" y="5" width="8" height="5" fill="#38bdf8" />
          {/* Arms */}
          <rect x="0" y="5" width="2" height="4" fill="#38bdf8" />
          <rect x="10" y="5" width="2" height="4" fill="#38bdf8" />
          {/* Legs */}
          <rect x="3" y="10" width="3" height="4" fill="#1e3a5a" />
          <rect x="7" y="10" width="3" height="4" fill="#1e3a5a" />
        </g>
      </svg>

      <div className="activity-row">
        <div className="activity-box" style={{ borderColor: 'var(--walk)', color: 'var(--walk)' }}>
          WALK {totals.walk.toFixed(1)}
        </div>
        <div className="activity-box" style={{ borderColor: 'var(--bike)', color: 'var(--bike)' }}>
          BIKE {totals.bike.toFixed(1)}
        </div>
        <div className="activity-box" style={{ borderColor: 'var(--swim)', color: 'var(--swim)' }}>
          SWIM {totals.swim.toFixed(1)}
        </div>
      </div>
    </div>
  )
}
