import { motion } from 'framer-motion'
import { useAppStore, type View } from '../../store/app'

const NAVS: { id: View; label: string; icon: string }[] = [
  { id: 'solar-system',   label: 'Solar System',   icon: '◎' },
  { id: 'constellations', label: 'Constellations',  icon: '✦' },
  { id: 'deep-space',     label: 'Deep Space',      icon: '◈' },
  { id: 'time-sim',       label: 'Time & Events',   icon: '◷' },
]

export default function TopNav() {
  const { view, setView, sidebarOpen, toggleSidebar } = useAppStore()
  const showSidebarToggle = view !== 'time-sim'

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-12 glass border-b border-panel-border flex items-center justify-between gap-2 px-2 sm:px-4"
    >
      {/* Left — sidebar toggle + logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
        {showSidebarToggle && (
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-cloud hover:text-star hover:bg-white/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>
              )}
            </svg>
          </button>
        )}
        <div className="w-5 h-5 relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-accent opacity-60" />
          <div className="absolute inset-1 rounded-full border border-accent opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-accent" />
        </div>
        <span className="hidden sm:inline text-star font-display font-semibold text-sm tracking-wide truncate">
          Nightshift Observatory
        </span>
      </div>

      {/* Center nav tabs */}
      <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
        {NAVS.map(nav => {
          const isActive = view === nav.id
          return (
            <button
              key={nav.id}
              onClick={() => setView(nav.id)}
              aria-label={nav.label}
              title={nav.label}
              className={`nav-btn text-xs relative px-2 sm:px-[0.85rem] ${isActive ? 'active' : ''}`}
            >
              <span className="opacity-60 text-sm leading-none">{nav.icon}</span>
              <span className="hidden md:inline">{nav.label}</span>
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
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow" />
          <span className="hidden sm:inline text-2xs font-mono text-muted tracking-wider">LIVE</span>
        </div>
        <div className="hidden lg:block text-2xs font-mono text-muted">
          {new Date().toUTCString().slice(5, 22)} UTC
        </div>
      </div>
    </motion.nav>
  )
}
