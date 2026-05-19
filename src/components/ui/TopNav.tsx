import { motion } from 'framer-motion'
import { useAppStore, type View } from '../../store/app'

const NAVS: { id: View; label: string; icon: string }[] = [
  { id: 'solar-system',   label: 'Solar System',   icon: '◎' },
  { id: 'constellations', label: 'Constellations',  icon: '✦' },
  { id: 'deep-space',     label: 'Deep Space',      icon: '◈' },
  { id: 'time-sim',       label: 'Time & Events',   icon: '◷' },
]

export default function TopNav() {
  const { view, setView } = useAppStore()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-12 glass border-b border-panel-border flex items-center justify-between px-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-5 h-5 relative">
          <div className="absolute inset-0 rounded-full border border-accent opacity-60" />
          <div className="absolute inset-1 rounded-full border border-accent opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-accent" />
        </div>
        <span className="text-star font-display font-semibold text-sm tracking-wide">
          Nightshift Observatory
        </span>
      </div>

      {/* Center nav tabs */}
      <div className="flex items-center gap-1">
        {NAVS.map(nav => {
          const isActive = view === nav.id
          return (
            <button
              key={nav.id}
              onClick={() => setView(nav.id)}
              className={`nav-btn text-xs relative ${isActive ? 'active' : ''}`}
            >
              <span className="opacity-60 text-sm leading-none">{nav.icon}</span>
              {nav.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Right side — live indicator */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow" />
          <span className="text-2xs font-mono text-muted tracking-wider">LIVE</span>
        </div>
        <div className="text-2xs font-mono text-muted">
          {new Date().toUTCString().slice(5, 22)} UTC
        </div>
      </div>
    </motion.nav>
  )
}
