import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPACECRAFT, type Spacecraft } from '../../data/astronomy'
import { useAppStore } from '../../store/app'
import { registerFocus } from './focusRegistry'

// ── Voyager: bus + high-gain dish + booms ───────────────────────────────────────
function VoyagerModel({ color }: { color: string }) {
  return (
    <group>
      {/* Ten-sided instrument bus */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.32, 10]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.7} />
      </mesh>

      {/* High-gain dish antenna */}
      <group position={[0, 0.55, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.15, 0.42, 32, 1, true]} />
          <meshStandardMaterial color="#efe6cf" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Feed horn on a tripod */}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color="#b0a480" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* RTG boom (power) */}
      <group position={[-1.05, -0.1, 0]}>
        <mesh position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
          <meshStandardMaterial color="#8a8375" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[-0.05, 0, 0]}>
          <boxGeometry args={[0.55, 0.16, 0.16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
      </group>

      {/* Science boom with magnetometer */}
      <group position={[1.05, -0.05, 0]}>
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.0, 6]} />
          <meshStandardMaterial color="#8a8375" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Long magnetometer whip */}
      <mesh position={[0, -0.2, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.2, 6]} />
        <meshStandardMaterial color="#9a9382" metalness={0.4} roughness={0.7} />
      </mesh>
    </group>
  )
}

// ── JWST: hex mirror + layered sunshield ────────────────────────────────────────
function hexOffsets(): [number, number][] {
  // 18 segments: rings around a (missing) centre, like the real primary mirror.
  const s = 0.34 // segment centre spacing
  const h = s * Math.sqrt(3) / 2
  const pts: [number, number][] = []
  // axial-ish hand-placed layout, 3 rows top + 3 rows bottom mirrored
  const rows: number[] = [4, 5, 4, 5]
  let y = 1.5 * h
  for (let r = 0; r < rows.length; r++) {
    const count = rows[r]
    const startX = -((count - 1) / 2) * s
    for (let i = 0; i < count; i++) pts.push([startX + i * s, y])
    y -= h
  }
  return pts
}

function JWSTModel({ color }: { color: string }) {
  const segments = useMemo(() => hexOffsets(), [])
  const hexGeo = useMemo(() => new THREE.CircleGeometry(0.2, 6), [])
  const mirrorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, metalness: 0.9, roughness: 0.25 }),
    [color],
  )

  return (
    <group>
      {/* Sunshield — five stacked kite-shaped membranes beneath the mirror */}
      <group position={[0, -0.7, 0.1]} rotation={[-0.5, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0, -i * 0.12]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[2.0, 2.0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#b9a6d6' : '#8f9fd0'}
              metalness={0.6}
              roughness={0.3}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Primary mirror — 18 gold hex segments */}
      <group position={[0, 0.35, 0]}>
        {segments.map(([x, y], i) => (
          <mesh key={i} geometry={hexGeo} material={mirrorMat} position={[x, y, 0]} rotation={[0, 0, Math.PI / 6]} />
        ))}
        {/* Secondary mirror on a tripod */}
        <mesh position={[0, 0.1, 0.9]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 12]} />
          <meshStandardMaterial color="#d9cfa0" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0.45]} rotation={[Math.PI / 2.4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 6]} />
          <meshStandardMaterial color="#555" metalness={0.4} roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// ── Selectable wrapper (positions, interaction, focus registration) ─────────────
function SpacecraftObject({ craft }: { craft: Spacecraft }) {
  const groupRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const { selectedId, hoveredId, setSelected, setHovered } = useAppStore()
  const isSelected = selectedId === craft.id
  const isHovered = hoveredId === craft.id
  const active = isSelected || isHovered

  // Static object — register its position once so the camera can fly to it.
  useEffect(() => {
    registerFocus(craft.id, new THREE.Vector3(...craft.position))
  }, [craft.id, craft.position])

  useFrame((_, delta) => {
    if (modelRef.current) modelRef.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={groupRef} position={craft.position}>
      {/* A soft marker glow so it's findable among the stars from a distance */}
      <mesh>
        <sphereGeometry args={[2.6, 16, 16]} />
        <meshBasicMaterial color={craft.glowColor} transparent opacity={active ? 0.1 : 0.05} depthWrite={false} />
      </mesh>

      {/* Generous invisible hit area — the models are thin and hard to click */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : craft.id) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(craft.id) }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
      >
        <sphereGeometry args={[2.4, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={modelRef}>
        {craft.model === 'voyager' ? <VoyagerModel color={craft.color} /> : <JWSTModel color={craft.color} />}
      </group>

      <pointLight color={craft.glowColor} intensity={active ? 1.2 : 0.5} distance={16} />

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.0, 0.04, 8, 80]} />
          <meshBasicMaterial color="#4d9ef7" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

export default function SpacecraftFleet() {
  return (
    <>
      {SPACECRAFT.map((c) => (
        <SpacecraftObject key={c.id} craft={c} />
      ))}
    </>
  )
}
