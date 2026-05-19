import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/app'
import { PLANETS, CONSTELLATIONS, DEEP_SPACE } from '../../data/astronomy'

export default function HoverTooltip() {
  const { hoveredId, selectedId, view } = useAppStore()

  // Don't show tooltip if object is already selected
  const show = hoveredId && hoveredId !== selectedId

  let name = '', sub = '', color = '#4d9ef7'

  if (show) {
    if (view === 'solar-system') {
      const p = PLANETS.find(p => p.id === hoveredId)
      if (p) { name = p.name; sub = p.type === 'star' ? 'Star' : 'Planet'; color = p.color }
    } else if (view === 'constellations') {
      const c = CONSTELLATIONS.find(c => c.id === hoveredId)
      if (c) { name = c.name; sub = 'Constellation'; color = c.color }
    } else if (view === 'deep-space') {
      const o = DEEP_SPACE.find(o => o.id === hoveredId)
      if (o) { name = o.name; sub = o.type; color = o.visualColor }
    }
  }

  return (
    <AnimatePresence>
      {show && name && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="glass border border-panel-border rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <div>
              <div className="text-sm font-semibold text-star">{name}</div>
              <div className="text-2xs font-mono text-muted capitalize">{sub} · Click to explore</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
