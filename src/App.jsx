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
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

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

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })
    if (error) {
      setLoginError(error.message)
    } else {
      setShowLogin(false)
      setLoginEmail('')
      setLoginPassword('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isOwner = !!user

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
    if (!isOwner) {
      alert('You must be logged in to save.')
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
      <div className="app-header">
        <h1 className="app-title">MILEAGE TRACKER 2026</h1>
        <div className="auth-area">
          {isOwner ? (
            <button className="auth-btn" onClick={handleLogout}>LOGOUT</button>
          ) : (
            <button className="auth-btn" onClick={() => setShowLogin(!showLogin)}>LOGIN</button>
          )}
        </div>
      </div>

      {showLogin && !isOwner && (
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-submit">SIGN IN</button>
          {loginError && <div className="login-error">{loginError}</div>}
        </form>
      )}

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
            readOnly={!isOwner}
          />
        )}
        {tab === 'PACE' && <PaceScreen totals={totals} entries={entries} />}
        {tab === 'SUMMARY' && <SummaryScreen totals={totals} entries={entries} />}
      </main>
    </div>
  )
}
