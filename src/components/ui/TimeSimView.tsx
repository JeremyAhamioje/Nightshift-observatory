import { useState } from 'react'
import { motion } from 'framer-motion'
import { COSMIC_EVENTS } from '../../data/astronomy'
import { useAppStore } from '../../store/app'

function MoonPhase({ date }: { date: Date }) {
  // Simplified moon phase calculation
  const synodicPeriod = 29.53059
  const knownNew = new Date('2024-01-11').getTime()
  const daysSince = (date.getTime() - knownNew) / (1000 * 60 * 60 * 24)
  const phase = ((daysSince % synodicPeriod) + synodicPeriod) % synodicPeriod
  const pct = phase / synodicPeriod

  const phaseNames = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
  ]
  const phaseIdx = Math.floor(pct * 8) % 8
  const phaseName = phaseNames[phaseIdx]

  // Draw moon phase
  const illumination = pct < 0.5 ? pct * 2 : (1 - pct) * 2
  const isWaxing = pct < 0.5

  return (
    <div className="flex items-center gap-4">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="#0d1520" stroke="#1e3251" strokeWidth="1" />
        <clipPath id="moon-clip">
          <circle cx="24" cy="24" r="20" />
        </clipPath>
        {/* Illuminated half */}
        {pct > 0.02 && pct < 0.98 && (
          <ellipse
            cx="24" cy="24"
            rx={Math.abs(illumination - 0.5) < 0.02 ? 20 : Math.abs((illumination * 40) - 20)}
            ry="20"
            fill="#c8d4e8"
            transform={isWaxing ? '' : 'scale(-1,1) translate(-48,0)'}
            clipPath="url(#moon-clip)"
          />
        )}
        {(pct <= 0.02) && <circle cx="24" cy="24" r="20" fill="#c8d4e8" clipPath="url(#moon-clip)" />}
        {(pct >= 0.98) && <circle cx="24" cy="24" r="20" fill="#c8d4e8" clipPath="url(#moon-clip)" />}
      </svg>
      <div>
        <div className="text-sm font-semibold text-star">{phaseName}</div>
        <div className="text-2xs font-mono text-muted">{Math.round(illumination * 100)}% illuminated</div>
        <div className="text-2xs font-mono text-muted">Day {Math.round(phase)} of cycle</div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: typeof COSMIC_EVENTS[0] }) {
  const [expanded, setExpanded] = useState(false)
  const typeColors: Record<string, string> = {
    eclipse: '#e85c4a', alignment: '#4d9ef7',
    meteor: '#e8a44a', transit: '#4ae8a4', opposition: '#c084fc',
  }
  const color = typeColors[event.type] || '#4d9ef7'

  return (
    <motion.div
      layout
      className="glass border border-panel-border rounded-xl overflow-hidden card-hover cursor-pointer"
      onClick={() => setExpanded(e => !e)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none mt-0.5">{event.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-star">{event.name}</h3>
              <span
                className="text-2xs font-mono px-1.5 py-0.5 rounded-full border"
                style={{ color, borderColor: `${color}40`, background: `${color}10` }}
              >
                {event.type.replace('-', ' ')}
              </span>
            </div>
            <div className="text-2xs font-mono text-muted mb-2">{event.date}</div>
            <p className="text-xs text-cloud leading-relaxed">{event.description}</p>
          </div>
          <div className="text-muted text-xs mt-0.5 flex-shrink-0">{expanded ? '▲' : '▼'}</div>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-panel-border px-4 pb-4 pt-3"
        >
          <p className="text-label mb-2">How to Observe</p>
          <div className="p-3 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
            <p className="text-xs text-moon leading-relaxed">{event.howToView}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function TimeSimView() {
  const { simDate, isPlaying, togglePlaying, timeScale, setTimeScale, setSimDate } = useAppStore()

  const slideDate = (days: number) => {
    const d = new Date(simDate)
    d.setDate(d.getDate() + days)
    setSimDate(d)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 top-12 flex flex-col items-center justify-start overflow-y-auto scroll-y bg-deep/50"
    >
      <div className="w-full max-w-3xl px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-display text-3xl text-star mb-1">Time & Events</h1>
          <p className="text-sm text-cloud">Explore astronomical events through time. Adjust the date to see what the sky holds.</p>
        </div>

        {/* Time control card */}
        <div className="glass border border-panel-border rounded-xl p-5">
          <p className="text-label mb-3">Simulation Date</p>

          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => slideDate(-365)} className="btn-toolbar">−1 yr</button>
            <button onClick={() => slideDate(-30)} className="btn-toolbar">−30d</button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-display text-star font-medium">
                {simDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <button onClick={() => slideDate(30)} className="btn-toolbar">+30d</button>
            <button onClick={() => slideDate(365)} className="btn-toolbar">+1 yr</button>
          </div>

          <input
            type="range"
            min={-1825}
            max={1825}
            value={Math.round((simDate.getTime() - Date.now()) / 86400000)}
            onChange={(e) => {
              const d = new Date()
              d.setDate(d.getDate() + parseInt(e.target.value))
              setSimDate(d)
            }}
            className="w-full mb-4"
            style={{ accentColor: '#4d9ef7' }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlaying}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  isPlaying ? 'bg-accent/15 text-accent border border-accent/30' : 'glass border border-panel-border text-cloud hover:text-star'
                }`}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <span className="text-2xs font-mono text-muted">time simulation</span>
            </div>
            <div className="flex items-center gap-1 glass border border-panel-border rounded-lg px-1.5 py-1">
              {[1, 10, 100, 1000].map(s => (
                <button
                  key={s}
                  onClick={() => setTimeScale(s)}
                  className={`px-2 py-0.5 rounded text-2xs font-mono transition-all ${timeScale === s ? 'bg-accent/15 text-accent' : 'text-muted hover:text-cloud'}`}
                >
                  {s < 1000 ? `${s}×` : '1k×'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Moon phase */}
        <div className="glass border border-panel-border rounded-xl p-5">
          <p className="text-label mb-3">Moon Phase</p>
          <MoonPhase date={simDate} />
        </div>

        {/* Upcoming events */}
        <div>
          <p className="text-label mb-3">Upcoming Celestial Events</p>
          <div className="space-y-3">
            {COSMIC_EVENTS.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div className="h-16" />
      </div>
    </motion.div>
  )
}
