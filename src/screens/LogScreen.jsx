import { useEffect, useRef } from 'react'
import { getAllDates, formatDate, dateToKey } from '../utils.js'
import './LogScreen.css'

const ALL_DATES = getAllDates()

function todayKey() {
  const t = new Date()
  return dateToKey(t)
}

export default function LogScreen({ entries, updateEntry, saveAll, saving }) {
  const todayRef = useRef(null)
  const tk = todayKey()

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const handleChange = (key, field, raw) => {
    const val = raw === '' ? 0 : parseFloat(raw) || 0
    updateEntry(key, field, Math.max(0, val))
  }

  return (
    <div className="log-screen">
      <div className="log-list">
        {ALL_DATES.map(date => {
          const key = dateToKey(date)
          const e = entries[key] || { walk: 0, bike: 0, swim: 0 }
          const total = e.walk + e.bike + e.swim
          const hasEntry = total > 0
          const isToday = key === tk

          return (
            <div
              key={key}
              ref={isToday ? todayRef : null}
              className={`log-row ${hasEntry ? 'has-entry' : ''} ${isToday ? 'today' : ''}`}
            >
              <span className="log-date">{formatDate(date)}</span>
              <div className="log-inputs">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="log-input walk-input"
                  value={e.walk || ''}
                  placeholder="0"
                  onChange={ev => handleChange(key, 'walk', ev.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="log-input bike-input"
                  value={e.bike || ''}
                  placeholder="0"
                  onChange={ev => handleChange(key, 'bike', ev.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="log-input swim-input"
                  value={e.swim || ''}
                  placeholder="0"
                  onChange={ev => handleChange(key, 'swim', ev.target.value)}
                />
                <span className="log-total">{total > 0 ? total.toFixed(1) : ''}</span>
              </div>
            </div>
          )
        })}
      </div>
      <button className="save-btn" onClick={saveAll} disabled={saving}>
        {saving ? 'SAVING...' : 'SAVE'}
      </button>
    </div>
  )
}
