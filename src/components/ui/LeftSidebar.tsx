import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/app'
import { PLANETS, CONSTELLATIONS, DEEP_SPACE } from '../../data/astronomy'

// Small color dot for planet
function PlanetDot({ color }: { color: string }) {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
    />
  )
}

function SolarSystemList() {
  const { selectedId, hoveredId, setSelected, setHovered } = useAppStore()

  return (
    <div className="flex flex-col gap-0.5">
      {PLANETS.map(planet => {
        const isActive = selectedId === planet.id
        const isHovered = hoveredId === planet.id
        return (
          <button
            key={planet.id}
            className={`planet-item w-full text-left ${isActive ? 'active' : ''}`}
            onClick={() => setSelected(isActive ? null : planet.id)}
            onMouseEnter={() => setHovered(planet.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <PlanetDot color={planet.color} />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-accent' : 'text-moon'}`}>
                {planet.name}
              </div>
              <div className="text-2xs font-mono text-muted truncate">
                {planet.type === 'star' ? 'G-type Star' : planet.type === 'dwarf' ? 'Dwarf Planet' : `${planet.moons} moon${planet.moons !== 1 ? 's' : ''}`}
              </div>
            </div>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function ConstellationList() {
  const { selectedId, setSelected, setHovered } = useAppStore()
  return (
    <div className="flex flex-col gap-0.5">
      {CONSTELLATIONS.map(c => {
        const isActive = selectedId === c.id
        return (
          <button
            key={c.id}
            className={`planet-item w-full text-left ${isActive ? 'active' : ''}`}
            onClick={() => setSelected(isActive ? null : c.id)}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-3 h-3 rounded-sm flex-shrink-0 border" style={{ borderColor: c.color, background: `${c.color}20` }} />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-accent' : 'text-moon'}`}>
                {c.name}
              </div>
              <div className="text-2xs font-mono text-muted">{c.season} · {c.hemisphere}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function DeepSpaceList() {
  const { selectedId, setSelected, setHovered } = useAppStore()
  const typeLabel: Record<string, string> = {
    nebula: 'Nebula', galaxy: 'Galaxy', 'black-hole': 'Black Hole',
    pulsar: 'Pulsar', cluster: 'Cluster',
  }
  return (
    <div className="flex flex-col gap-0.5">
      {DEEP_SPACE.map(obj => {
        const isActive = selectedId === obj.id
        return (
          <button
            key={obj.id}
            className={`planet-item w-full text-left ${isActive ? 'active' : ''}`}
            onClick={() => setSelected(isActive ? null : obj.id)}
            onMouseEnter={() => setHovered(obj.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: obj.visualColor, boxShadow: `0 0 8px ${obj.glowColor}80` }} />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-accent' : 'text-moon'}`}>
                {obj.name}
              </div>
              <div className="text-2xs font-mono text-muted">{typeLabel[obj.type]}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function LeftSidebar() {
  const { view } = useAppStore()

  const getTitle = () => {
    if (view === 'solar-system') return 'Solar System'
    if (view === 'constellations') return 'Constellations'
    if (view === 'deep-space') return 'Deep Space'
    return null
  }

  if (view === 'time-sim') return null

  const title = getTitle()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed top-12 left-0 bottom-0 w-52 glass border-r border-panel-border z-40 flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-panel-border flex-shrink-0">
        <p className="text-label mb-0.5">Explore</p>
        <p className="text-sm font-semibold text-star">{title}</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scroll-y p-2">
        <AnimatePresence mode="wait">
          {view === 'solar-system' && (
            <motion.div key="solar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SolarSystemList />
            </motion.div>
          )}
          {view === 'constellations' && (
            <motion.div key="const" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ConstellationList />
            </motion.div>
          )}
          {view === 'deep-space' && (
            <motion.div key="deep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DeepSpaceList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-panel-border flex-shrink-0">
        <p className="text-2xs font-mono text-muted leading-relaxed">
          Click an object to explore. Drag to orbit. Scroll to zoom.
        </p>
      </div>
    </motion.aside>
  )
}
