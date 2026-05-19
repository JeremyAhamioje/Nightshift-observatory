import { motion } from 'framer-motion'
import { useAppStore } from '../../store/app'

const TIME_SCALES = [
  { label: '1×', value: 1 },
  { label: '10×', value: 10 },
  { label: '100×', value: 100 },
  { label: '1k×', value: 1000 },
]

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BottomToolbar() {
  const {
    view, isPlaying, togglePlaying, timeScale, setTimeScale,
    simDate, showLabels, showOrbits, toggleLabels, toggleOrbits,
  } = useAppStore()

  const showTimeControls = view === 'solar-system' || view === 'time-sim'
  const showViewControls = view === 'solar-system'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass border border-panel-border rounded-xl px-3 py-2 flex items-center gap-1 shadow-panel">

        {/* Time controls */}
        {showTimeControls && (
          <>
            {/* Play / Pause */}
            <button
              onClick={togglePlaying}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                isPlaying
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-cloud hover:text-star hover:bg-white/5'
              }`}
              title={isPlaying ? 'Pause' : 'Play time simulation'}
            >
              {isPlaying ? (
                // Pause icon
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="2" y="1.5" width="3" height="9" rx="1"/>
                  <rect x="7" y="1.5" width="3" height="9" rx="1"/>
                </svg>
              ) : (
                // Play icon
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2.5 1.5 L10.5 6 L2.5 10.5 Z" />
                </svg>
              )}
            </button>

            {/* Date display */}
            <div className="px-2.5 py-1 rounded-lg border border-panel-border bg-white/[0.02] min-w-[118px] text-center">
              <span className="text-2xs font-mono text-moon">{formatDate(simDate)}</span>
            </div>

            {/* Step back */}
            <button
              onClick={() => {
                const d = new Date(simDate)
                d.setDate(d.getDate() - 30)
                useAppStore.getState().setSimDate(d)
              }}
              className="flex items-center justify-center w-7 h-7 rounded text-muted hover:text-moon transition-colors text-xs"
              title="Back 30 days"
            >
              ‹‹
            </button>

            {/* Step forward */}
            <button
              onClick={() => {
                const d = new Date(simDate)
                d.setDate(d.getDate() + 30)
                useAppStore.getState().setSimDate(d)
              }}
              className="flex items-center justify-center w-7 h-7 rounded text-muted hover:text-moon transition-colors text-xs"
              title="Forward 30 days"
            >
              ››
            </button>

            {/* Time scale */}
            <div className="flex items-center gap-0.5 ml-1 mr-1 px-1.5 py-1 border border-panel-border rounded-lg">
              {TIME_SCALES.map(ts => (
                <button
                  key={ts.value}
                  onClick={() => setTimeScale(ts.value)}
                  className={`px-1.5 py-0.5 rounded text-2xs font-mono transition-all ${
                    timeScale === ts.value
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted hover:text-moon'
                  }`}
                >
                  {ts.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-panel-border mx-0.5" />
          </>
        )}

        {/* View toggles */}
        {showViewControls && (
          <>
            <ToggleBtn
              label="Orbits"
              active={showOrbits}
              onClick={toggleOrbits}
              icon="⌀"
            />
            <ToggleBtn
              label="Labels"
              active={showLabels}
              onClick={toggleLabels}
              icon="Aa"
            />
            <div className="w-px h-5 bg-panel-border mx-0.5" />
          </>
        )}

        {/* Zoom hint */}
        <div className="flex items-center gap-1.5 px-1.5">
          <span className="text-2xs font-mono text-muted">Scroll: Zoom</span>
          <span className="text-2xs font-mono text-muted opacity-40">·</span>
          <span className="text-2xs font-mono text-muted">Drag: Orbit</span>
        </div>
      </div>
    </motion.div>
  )
}

function ToggleBtn({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-medium transition-all ${
        active
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'text-muted hover:text-cloud border border-transparent'
      }`}
    >
      <span className="text-xs opacity-70">{icon}</span>
      {label}
    </button>
  )
}
