import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/app'
import { PLANETS, CONSTELLATIONS, DEEP_SPACE } from '../../data/astronomy'

// ── Solar System info ─────────────────────────────────────────────────────────
function PlanetInfo({ id }: { id: string }) {
  const planet = PLANETS.find(p => p.id === id)
  if (!planet) return null

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-panel-border">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 mt-0.5"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color)}, ${planet.color} 60%, ${darken(planet.color)} 100%)`,
              boxShadow: `0 0 20px ${planet.color}40`,
            }}
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-display text-lg text-star font-semibold">{planet.name}</h2>
              <span className="badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.5rem' }}>
                {planet.type === 'star' ? 'Star' : planet.type === 'dwarf' ? 'Dwarf Planet' : 'Planet'}
              </span>
            </div>
            <p className="text-2xs font-mono text-muted">{'Our Solar System'}</p>
          </div>
        </div>
        <p className="text-xs text-cloud leading-relaxed">{planet.description}</p>
      </div>

      {/* Stats grid */}
      <div className="p-3 border-b border-panel-border">
        <p className="text-label mb-2">Key Facts</p>
        <div className="space-y-0">
          <StatRow label="Diameter" value={planet.diameter} />
          <StatRow label="Distance from Sun" value={planet.distanceFromSun} />
          <StatRow label="Day Length" value={planet.dayLength} />
          <StatRow label="Surface Temp" value={planet.surfaceTemp} />
          <StatRow label="Moons" value={planet.moons.toString()} />
          <StatRow label="Atmosphere" value={planet.atmosphere} />
        </div>
      </div>

      {/* Fun fact */}
      <div className="p-4">
        <p className="text-label mb-2">Did You Know?</p>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(77,158,247,0.06)', border: '1px solid rgba(77,158,247,0.12)' }}>
          <p className="text-xs text-moon leading-relaxed">{planet.funFact}</p>
        </div>
      </div>
    </div>
  )
}

// ── Constellation info ────────────────────────────────────────────────────────
function ConstellationInfo({ id }: { id: string }) {
  const c = CONSTELLATIONS.find(c => c.id === id)
  if (!c) return null

  return (
    <div className="animate-slide-up">
      <div className="p-4 border-b border-panel-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-sm border" style={{ borderColor: c.color, background: `${c.color}25` }} />
          <h2 className="text-display text-lg text-star font-semibold">{c.name}</h2>
        </div>
        <p className="text-2xs font-mono text-muted mb-3">{c.latin} · {c.hemisphere} Hemisphere · {c.season}</p>
        <div className="flex gap-2 flex-wrap">
          {c.brightestStar && (
            <span className="badge">★ {c.brightestStar}</span>
          )}
          <span className="badge">{c.stars.length} main stars</span>
          <span className="badge">{c.area}</span>
        </div>
      </div>

      <div className="p-4 border-b border-panel-border">
        <p className="text-label mb-2">Mythology</p>
        <p className="text-xs text-cloud leading-relaxed">{c.mythology}</p>
      </div>

      <div className="p-4 border-b border-panel-border">
        <p className="text-label mb-2">How to Find It</p>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(77,158,247,0.06)', border: '1px solid rgba(77,158,247,0.12)' }}>
          <p className="text-xs text-moon leading-relaxed">{c.howToFind}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-label mb-2">Named Stars</p>
        <div className="flex flex-wrap gap-1.5">
          {c.stars.filter(s => s.name).map(s => (
            <span key={s.id} className="text-2xs font-mono text-cloud bg-mist/30 rounded px-2 py-0.5 border border-panel-border">
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Deep Space info ───────────────────────────────────────────────────────────
function DeepSpaceInfo({ id }: { id: string }) {
  const obj = DEEP_SPACE.find(o => o.id === id)
  if (!obj) return null

  const typeLabel: Record<string, string> = {
    nebula: 'Emission Nebula', galaxy: 'Spiral Galaxy',
    'black-hole': 'Supermassive Black Hole', pulsar: 'Pulsar / Supernova Remnant', cluster: 'Star Cluster',
  }

  return (
    <div className="animate-slide-up">
      <div className="p-4 border-b border-panel-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ background: obj.visualColor, boxShadow: `0 0 8px ${obj.glowColor}` }} />
          <h2 className="text-display text-lg text-star font-semibold leading-tight">{obj.name}</h2>
        </div>
        <p className="text-2xs font-mono text-muted mb-3">{typeLabel[obj.type]}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="badge">{obj.distance}</span>
          <span className="badge">{obj.size}</span>
        </div>
      </div>

      <div className="p-4 border-b border-panel-border">
        <p className="text-label mb-2">Overview</p>
        <p className="text-xs text-cloud leading-relaxed">{obj.description}</p>
      </div>

      <div className="p-4 border-b border-panel-border">
        <p className="text-label mb-2">The Science</p>
        <p className="text-xs text-cloud leading-relaxed">{obj.science}</p>
      </div>

      <div className="p-4 border-b border-panel-border">
        <p className="text-label mb-2">Discovery</p>
        <p className="text-xs text-cloud leading-relaxed">{obj.discovery}</p>
      </div>

      <div className="p-4">
        <p className="text-label mb-2">Fascinating Facts</p>
        <div className="space-y-2">
          {obj.facts.map((fact, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-accent text-xs mt-0.5 flex-shrink-0">◆</span>
              <p className="text-xs text-cloud leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Shared utilities ──────────────────────────────────────────────────────────
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-row">
      <span className="text-2xs font-mono text-muted">{label}</span>
      <span className="text-xs font-medium text-moon text-right">{value}</span>
    </div>
  )
}

function lighten(hex: string) {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  return `rgb(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)})`
}
function darken(hex: string) {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  return `rgb(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)})`
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function InfoPanel() {
  const { selectedId, setSelected, view } = useAppStore()

  const isOpen = !!selectedId

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key={selectedId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-12 right-0 bottom-0 w-72 glass border-l border-panel-border z-40 flex flex-col"
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-panel-border flex-shrink-0">
            <span className="text-label">Object Info</span>
            <button
              onClick={() => setSelected(null)}
              className="w-6 h-6 flex items-center justify-center rounded text-muted hover:text-moon hover:bg-white/5 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scroll-y">
            {view === 'solar-system' && selectedId && <PlanetInfo id={selectedId} />}
            {view === 'constellations' && selectedId && <ConstellationInfo id={selectedId} />}
            {view === 'deep-space' && selectedId && <DeepSpaceInfo id={selectedId} />}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
