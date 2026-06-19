import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { getAllDates, dateToKey } from './utils.js'
import MapScreen from './screens/MapScreen.jsx'
import LogScreen from './screens/LogScreen.jsx'
import PaceScreen from './screens/PaceScreen.jsx'
import SummaryScreen from './screens/SummaryScreen.jsx'
import './App.css'

const TABS = ['MAP', 'LOG', 'PACE', 'SUMMARY']

export default function App() {
  const [tab, setTab] = useState('MAP')
  const [entries, setEntries] = useState(() => {
    const map = {}
    getAllDates().forEach(d => {
      map[dateToKey(d)] = { walk: 0, bike: 0, swim: 0 }
    })
    return map
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('mileage_logs')
      .select('*')
      .gte('log_date', '2026-01-01')
      .lte('log_date', '2026-12-31')
      .then(({ data }) => {
        if (!data) return
        setEntries(prev => {
          const next = { ...prev }
          data.forEach(row => {
            next[row.log_date] = {
              walk: Number(row.walk_miles) || 0,
              bike: Number(row.bike_miles) || 0,
              swim: Number(row.swim_miles) || 0,
            }
          })
          return next
        })
      })
  }, [])

  const updateEntry = (key, field, value) => {
    setEntries(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const saveAll = async () => {
    if (!supabase) {
      alert('Supabase not configured. Add your credentials to .env')
      return
    }
    setSaving(true)
    const rows = Object.entries(entries)
      .filter(([, v]) => v.walk > 0 || v.bike > 0 || v.swim > 0)
      .map(([date, v]) => ({
        log_date: date,
        walk_miles: v.walk,
        bike_miles: v.bike,
        swim_miles: v.swim,
        updated_at: new Date().toISOString(),
      }))
    if (rows.length > 0) {
      await supabase.from('mileage_logs').upsert(rows, { onConflict: 'log_date' })
    }
    setSaving(false)
  }

  const totals = Object.values(entries).reduce(
    (acc, e) => ({
      walk: acc.walk + e.walk,
      bike: acc.bike + e.bike,
      swim: acc.swim + e.swim,
    }),
    { walk: 0, bike: 0, swim: 0 }
  )
  totals.all = totals.walk + totals.bike + totals.swim

  return (
    <div className="app">
      <h1 className="app-title">MILEAGE TRACKER 2026</h1>
      <nav className="nav-bar">
        {TABS.map(t => (
          <button
            key={t}
            className={`nav-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <main>
        {tab === 'MAP' && <MapScreen totals={totals} />}
        {tab === 'LOG' && (
          <LogScreen
            entries={entries}
            updateEntry={updateEntry}
            saveAll={saveAll}
            saving={saving}
          />
        )}
        {tab === 'PACE' && <PaceScreen totals={totals} entries={entries} />}
        {tab === 'SUMMARY' && <SummaryScreen totals={totals} entries={entries} />}
      </main>
    </div>
  )
}
