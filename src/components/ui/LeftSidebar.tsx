import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/app'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { PLANETS, CONSTELLATIONS, DEEP_SPACE, MOON, ASTEROID_BELT, SPACECRAFT } from '../../data/astronomy'

// Small color dot with a soft glow, shared by the non-planet entries
function GlowDot({ color, glow, rounded = 'full' }: { color: string; glow?: string; rounded?: 'full' | 'sm' }) {
  return (
    <div
      className={`w-3 h-3 flex-shrink-0 ${rounded === 'full' ? 'rounded-full' : 'rounded-sm'}`}
      style={{ background: color, boxShadow: glow ? `0 0 8px ${glow}80` : undefined }}
    />
  )
}

// Small color dot for planet
function PlanetDot({ color }: { color: string }) {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
    />
  )
}

function PlanetRow({ planet }: { planet: typeof PLANETS[number] }) {
  const { selectedId, setSelected, setHovered } = useAppStore()
  const isActive = selectedId === planet.id
  return (
    <button
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
      {isActive && <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />}
    </button>
  )
}

function SolarSystemList() {
  const { selectedId, setSelected, setHovered } = useAppStore()
  const [earthOpen, setEarthOpen] = useState(false)

  // Auto-expand the Earth group whenever Earth or the Moon is the active object.
  useEffect(() => {
    if (selectedId === 'earth' || selectedId === 'moon') setEarthOpen(true)
  }, [selectedId])

  const earth = PLANETS.find(p => p.id === 'earth')!
  const earthActive = selectedId === 'earth'
  const moonActive = selectedId === 'moon'

  return (
    <div className="flex flex-col gap-0.5">
      {PLANETS.map(planet => {
        if (planet.id !== 'earth') return <PlanetRow key={planet.id} planet={planet} />

        // Earth is expandable — a dropdown that reveals its Moon.
        return (
          <div key="earth">
            <div className="flex items-stretch gap-0.5">
              <button
                className={`planet-item flex-1 text-left ${earthActive ? 'active' : ''}`}
                onClick={() => setSelected(earthActive ? null : 'earth')}
                onMouseEnter={() => setHovered('earth')}
                onMouseLeave={() => setHovered(null)}
              >
                <PlanetDot color={earth.color} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate transition-colors ${earthActive ? 'text-accent' : 'text-moon'}`}>
                    Earth
                  </div>
                  <div className="text-2xs font-mono text-muted truncate">1 moon</div>
                </div>
              </button>
              <button
                onClick={() => setEarthOpen(o => !o)}
                aria-label={earthOpen ? 'Hide moons' : 'Show moons'}
                aria-expanded={earthOpen}
                className="w-8 flex-shrink-0 flex items-center justify-center rounded-lg text-muted hover:text-moon hover:bg-white/5 transition-colors"
              >
                <svg
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${earthOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {earthOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <button
                    className={`planet-item w-full text-left pl-7 mt-0.5 ${moonActive ? 'active' : ''}`}
                    onClick={() => setSelected(moonActive ? null : 'moon')}
                    onMouseEnter={() => setHovered('moon')}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <GlowDot color={MOON.color} glow={MOON.glowColor} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate transition-colors ${moonActive ? 'text-accent' : 'text-moon'}`}>
                        {MOON.name}
                      </div>
                      <div className="text-2xs font-mono text-muted truncate">Satellite</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Beyond the planets — belt + spacecraft */}
      <div className="mt-3 mb-1 px-2">
        <p className="text-label">Beyond the Planets</p>
      </div>

      <ExtraRow id={ASTEROID_BELT.id} name={ASTEROID_BELT.name} sub="Asteroid Belt" color={ASTEROID_BELT.color} glow={ASTEROID_BELT.glowColor} />
      {SPACECRAFT.map(sc => (
        <ExtraRow key={sc.id} id={sc.id} name={sc.name} sub="Spacecraft" color={sc.color} glow={sc.glowColor} />
      ))}
    </div>
  )
}

function ExtraRow({ id, name, sub, color, glow }: { id: string; name: string; sub: string; color: string; glow: string }) {
  const { selectedId, setSelected, setHovered } = useAppStore()
  const isActive = selectedId === id
  return (
    <button
      className={`planet-item w-full text-left ${isActive ? 'active' : ''}`}
      onClick={() => setSelected(isActive ? null : id)}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
    >
      <GlowDot color={color} glow={glow} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-accent' : 'text-moon'}`}>
          {name}
        </div>
        <div className="text-2xs font-mono text-muted truncate">{sub}</div>
      </div>
      {isActive && <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />}
    </button>
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
  const { view, sidebarOpen, setSidebarOpen, selectedId } = useAppStore()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const getTitle = () => {
    if (view === 'solar-system') return 'Solar System'
    if (view === 'constellations') return 'Constellations'
    if (view === 'deep-space') return 'Deep Space'
    return null
  }

  // On phones the drawer overlays the scene, so collapse it once something is
  // picked to reveal the object + its info panel.
  useEffect(() => {
    if (isMobile && selectedId) setSidebarOpen(false)
  }, [isMobile, selectedId, setSidebarOpen])

  if (view === 'time-sim') return null

  const title = getTitle()

  return (
    <>
      {/* Backdrop — mobile only, dims the scene behind the open drawer */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-12 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-105%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed top-12 left-0 bottom-0 w-60 sm:w-52 glass border-r border-panel-border z-40 flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-panel-border flex-shrink-0 flex items-start justify-between gap-2">
          <div>
            <p className="text-label mb-0.5">Explore</p>
            <p className="text-sm font-semibold text-star">{title}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
            className="w-7 h-7 -mr-1 flex items-center justify-center rounded text-muted hover:text-moon hover:bg-white/5 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
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
            Tap an object to explore. Drag to orbit. Pinch or scroll to zoom.
          </p>
        </div>
      </motion.aside>
    </>
  )
}
