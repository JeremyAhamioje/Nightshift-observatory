import { create } from 'zustand'

export type View = 'solar-system' | 'constellations' | 'deep-space' | 'time-sim'

interface AppState {
  view: View
  selectedId: string | null
  hoveredId: string | null
  timeScale: number
  simDate: Date
  isPlaying: boolean
  showLabels: boolean
  showOrbits: boolean

  setView: (v: View) => void
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  setTimeScale: (s: number) => void
  setSimDate: (d: Date) => void
  togglePlaying: () => void
  toggleLabels: () => void
  toggleOrbits: () => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'solar-system',
  selectedId: null,
  hoveredId: null,
  timeScale: 1,
  simDate: new Date(),
  isPlaying: false,
  showLabels: true,
  showOrbits: true,

  setView: (view) => set({ view, selectedId: null, hoveredId: null }),
  setSelected: (selectedId) => set({ selectedId }),
  setHovered: (hoveredId) => set({ hoveredId }),
  setTimeScale: (timeScale) => set({ timeScale }),
  setSimDate: (simDate) => set({ simDate }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
}))
