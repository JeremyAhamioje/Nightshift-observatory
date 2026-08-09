import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/app'
import TopNav from './components/ui/TopNav'
import LeftSidebar from './components/ui/LeftSidebar'
import InfoPanel from './components/ui/InfoPanel'
import BottomToolbar from './components/ui/BottomToolbar'
import HoverTooltip from './components/ui/HoverTooltip'
import TimeSimView from './components/ui/TimeSimView'

// Lazy-load heavy 3D scenes
const SolarSystemScene = lazy(() => import('./components/3d/SolarSystemScene'))
const ConstellationScene = lazy(() => import('./components/3d/ConstellationScene'))
const DeepSpaceScene = lazy(() => import('./components/3d/DeepSpaceScene'))

function SceneLoader() {
  // Three.js-compatible fallback for Suspense inside <Canvas>
  return (
    <group>
      {/* Simple spinning mesh as a 3D loading indicator */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[8, 1.5, 16, 100]} />
        <meshStandardMaterial color="#4d9ef7" emissive="#1e3251" emissiveIntensity={0.5} />
      </mesh>
      <ambientLight intensity={0.2} />
    </group>
  )
}

function ActiveScene() {
  const { view } = useAppStore()
  // Only return Three.js elements for Canvas
  if (view === 'solar-system') {
    return (
      <Suspense fallback={<SceneLoader />}>
        <SolarSystemScene />
      </Suspense>
    )
  }
  if (view === 'constellations') {
    return (
      <Suspense fallback={<SceneLoader />}>
        <ConstellationScene />
      </Suspense>
    )
  }
  if (view === 'deep-space') {
    return (
      <Suspense fallback={<SceneLoader />}>
        <DeepSpaceScene />
      </Suspense>
    )
  }
  return null
}


export default function App() {
  const { view } = useAppStore()
  const is3D = view !== 'time-sim'

  return (
    <div className="w-full h-full bg-void overflow-hidden relative">
      {/* 3D Canvas */}
      {is3D && (
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 30, 80], fov: 55, near: 0.1, far: 2000 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <ActiveScene />
        </Canvas>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNav />
        </div>
        {is3D && (
          <div className="pointer-events-auto">
            <LeftSidebar />
            <InfoPanel />
            <HoverTooltip />
            <BottomToolbar />
          </div>
        )}
        {view === 'time-sim' && (
          <div className="pointer-events-auto">
            <TimeSimView />
            <BottomToolbar />
          </div>
        )}
      </div>

      {/* Subtle vignette for depth */}
      {is3D && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,6,10,0.6) 100%)',
          }}
        />
      )}
    </div>
  )
}
