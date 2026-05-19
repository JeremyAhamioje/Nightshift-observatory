import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CONSTELLATIONS, type Constellation } from '../../data/astronomy'
import { useAppStore } from '../../store/app'

function Controls() {
  const { camera, gl } = useThree()
  const ref = useRef<OrbitControls | null>(null)
  useEffect(() => {
    const ctrl = new OrbitControls(camera, gl.domElement)
    ctrl.enableDamping = true; ctrl.dampingFactor = 0.05
    ctrl.minDistance = 5; ctrl.maxDistance = 40
    ctrl.enablePan = false; ctrl.rotateSpeed = 0.35
    ref.current = ctrl
    return () => ctrl.dispose()
  }, [camera, gl])
  useFrame(() => ref.current?.update())
  return null
}

// Full night sky background stars
function NightSky() {
  const geo = useMemo(() => {
    const N = 15000
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 80
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      const b = 0.3 + Math.random() * 0.7
      const warm = Math.random() < 0.1
      col[i*3]   = warm ? b : b * 0.85
      col[i*3+1] = warm ? b * 0.75 : b * 0.9
      col[i*3+2] = warm ? b * 0.4 : b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.12} vertexColors sizeAttenuation transparent opacity={0.7} fog={false} />
    </points>
  )
}

// Map constellation star to 3D position on dome
function starTo3D(x: number, y: number): [number, number, number] {
  // x,y in 0-1 → map to spherical dome
  const theta = (x - 0.5) * Math.PI * 1.4   // azimuth
  const phi   = (y - 0.5) * Math.PI * 0.8   // elevation
  const r = 18
  return [
    r * Math.cos(phi) * Math.sin(theta),
    -r * Math.sin(phi),
    r * Math.cos(phi) * Math.cos(theta),
  ]
}

// One constellation group
function ConstellationGroup({ constellation, index }: { constellation: Constellation; index: number }) {
  const { selectedId, hoveredId, setSelected, setHovered } = useAppStore()
  const isSelected = selectedId === constellation.id
  const isHovered = hoveredId === constellation.id

  const active = isSelected || isHovered

  // Stagger offset so constellations spread around sky
  const offset = (index / CONSTELLATIONS.length) * Math.PI * 2

  // Build star positions
  const starPositions = useMemo(() =>
    constellation.stars.reduce((acc, star) => {
      const [x, y, z] = starTo3D(star.x, star.y)
      acc[star.id] = new THREE.Vector3(x, y, z)
      return acc
    }, {} as Record<string, THREE.Vector3>)
  , [constellation])

  // Build line geometry from pairs
  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (const [a, b] of constellation.lines) {
      if (starPositions[a] && starPositions[b]) {
        pts.push(starPositions[a].clone())
        pts.push(starPositions[b].clone())
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [constellation, starPositions])

  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = offset
  }, [offset])

  const color = new THREE.Color(constellation.color)

  return (
    <group ref={groupRef}>
      {/* Constellation lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color={constellation.color}
          transparent
          opacity={active ? 0.6 : 0.12}
          linewidth={1}
        />
      </lineSegments>

      {/* Stars */}
      {constellation.stars.map((star) => {
        const pos = starPositions[star.id]
        if (!pos) return null
        const isBright = star.brightness > 0.8
        const r = isBright ? 0.14 : 0.09

        return (
          <group key={star.id} position={pos}>
            {/* Glow */}
            <mesh>
              <sphereGeometry args={[r * 3, 8, 8]} />
              <meshBasicMaterial
                color={constellation.color}
                transparent
                opacity={active ? (star.brightness * 0.25) : 0.04}
                depthWrite={false}
              />
            </mesh>
            {/* Star dot */}
            <mesh
              onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : constellation.id) }}
              onPointerEnter={(e) => { e.stopPropagation(); setHovered(constellation.id) }}
              onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
            >
              <sphereGeometry args={[r, 10, 10]} />
              <meshBasicMaterial color={active ? constellation.color : '#c8d4e8'} />
            </mesh>
          </group>
        )
      })}

      {/* Constellation name label position (we render in DOM) */}
      {active && constellation.stars[0] && (
        <mesh position={starPositions[constellation.stars[0].id]}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color={constellation.color} />
        </mesh>
      )}
    </group>
  )
}

export default function ConstellationScene() {
  const { setSelected, setHovered } = useAppStore()

  return (
    <>
      <color attach="background" args={['#04060a']} />
      <ambientLight intensity={0.02} />

      {/* Sky dome for clicking empty space */}
      <mesh onClick={() => { setSelected(null); setHovered(null) }}>
        <sphereGeometry args={[79, 16, 16]} />
        <meshBasicMaterial color="#04060a" transparent opacity={0} side={THREE.BackSide} />
      </mesh>

      <NightSky />

      {CONSTELLATIONS.map((c, i) => (
        <ConstellationGroup key={c.id} constellation={c} index={i} />
      ))}

      <Controls />
    </>
  )
}
