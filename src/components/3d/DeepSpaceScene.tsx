import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DEEP_SPACE, type DeepSpaceObject } from '../../data/astronomy'
import { useAppStore } from '../../store/app'
import BlackHole from './BlackHole'
import PostProcessing from './PostProcessing'

function Controls() {
  const { camera, gl } = useThree()
  const ref = useRef<OrbitControls | null>(null)
  useEffect(() => {
    const ctrl = new OrbitControls(camera, gl.domElement)
    ctrl.enableDamping = true; ctrl.dampingFactor = 0.06
    ctrl.minDistance = 3; ctrl.maxDistance = 80
    ctrl.enablePan = true; ctrl.panSpeed = 0.4
    ref.current = ctrl
    return () => ctrl.dispose()
  }, [camera, gl])
  useFrame(() => ref.current?.update())
  return null
}

function DeepStars() {
  const geo = useMemo(() => {
    const N = 10000
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 180 + Math.random() * 100
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      const b = 0.3 + Math.random() * 0.6
      col[i*3] = b * 0.85; col[i*3+1] = b * 0.9; col[i*3+2] = b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.4} vertexColors sizeAttenuation transparent opacity={0.7} fog={false} />
    </points>
  )
}

// Nebula visualization
function Nebula({ obj, position }: { obj: DeepSpaceObject; position: [number, number, number] }) {
  const { selectedId, hoveredId, setSelected, setHovered } = useAppStore()
  const isSelected = selectedId === obj.id
  const isHovered = hoveredId === obj.id
  const active = isSelected || isHovered
  const groupRef = useRef<THREE.Group>(null)

  // Procedural nebula texture
  const tex = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, size, size)
    const c = new THREE.Color(obj.visualColor)
    // Multiple overlapping clouds
    for (let i = 0; i < 12; i++) {
      const x = (0.2 + Math.random() * 0.6) * size
      const y = (0.2 + Math.random() * 0.6) * size
      const r = (0.15 + Math.random() * 0.35) * size
      const alpha = 0.05 + Math.random() * 0.15
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${alpha})`)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(canvas)
  }, [obj.visualColor, obj.id])

  useFrame(() => {
    if (!groupRef.current) return
    // The black hole keeps a fixed orientation — its disk animates in its own shader
    if (obj.type !== 'black-hole') {
      groupRef.current.rotation.y += 0.0005
      groupRef.current.rotation.z += 0.0002
    }
    if (active) groupRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.05)
    else groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05)
  })

  const size = obj.type === 'galaxy' ? 4 : obj.type === 'black-hole' ? 1.5 : 3

  // Black holes get their own shader-driven treatment
  if (obj.type === 'black-hole') {
    return (
      <group ref={groupRef} position={position}>
        <BlackHole
          radius={size}
          glowColor={obj.glowColor}
          active={active}
          selected={isSelected}
          onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : obj.id) }}
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(obj.id) }}
          onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
        />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial color={obj.glowColor} transparent opacity={active ? 0.06 : 0.025} depthWrite={false} />
      </mesh>

      {/* Main body */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : obj.id) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(obj.id) }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
      >
        {obj.type === 'galaxy' ? (
          <cylinderGeometry args={[size, size * 0.3, size * 0.15, 32, 1, false]} />
        ) : (
          <sphereGeometry args={[size, 24, 24]} />
        )}
        <meshBasicMaterial map={tex} color="#ffffff" transparent opacity={0.7} />
      </mesh>

      {/* Nebula glow layers */}
      {(obj.type === 'nebula' || obj.type === 'pulsar') && (
        <>
          <mesh>
            <sphereGeometry args={[size * 1.4, 16, 16]} />
            <meshBasicMaterial map={tex} transparent opacity={active ? 0.5 : 0.25} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          {obj.type === 'pulsar' && (
            <PulsarBeams size={size} active={active} />
          )}
        </>
      )}

      {/* Galaxy disk */}
      {obj.type === 'galaxy' && (
        <GalaxyDisk size={size} color={obj.visualColor} tex={tex} active={active} />
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.6, 0.05, 8, 64]} />
          <meshBasicMaterial color="#4d9ef7" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

function PulsarBeams({ size, active }: { size: number; active: boolean }) {
  const ref1 = useRef<THREE.Mesh>(null)
  const ref2 = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref1.current) ref1.current.rotation.y = t * 5
    if (ref2.current) ref2.current.rotation.y = t * 5 + Math.PI
  })
  return (
    <>
      <mesh ref={ref1}>
        <coneGeometry args={[size * 0.15, size * 6, 8]} />
        <meshBasicMaterial color="#88ccff" transparent opacity={active ? 0.4 : 0.15} />
      </mesh>
      <mesh ref={ref2} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[size * 0.15, size * 6, 8]} />
        <meshBasicMaterial color="#88ccff" transparent opacity={active ? 0.4 : 0.15} />
      </mesh>
    </>
  )
}

function GalaxyDisk({ size, color, tex, active }: { size: number; color: string; tex: THREE.Texture; active: boolean }) {
  const diskRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.y += delta * 0.05
  })
  return (
    <>
      {/* Spiral arms approximation */}
      <mesh ref={diskRef}>
        <cylinderGeometry args={[size * 1.8, size * 0.5, size * 0.08, 64, 1]} />
        <meshBasicMaterial map={tex} transparent opacity={active ? 0.8 : 0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Core bulge */}
      <mesh>
        <sphereGeometry args={[size * 0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.7} />
      </mesh>
    </>
  )
}

// Positions for objects in 3D space
const POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [-22, 5, -10],
  [18, -4, 15],
  [0, 8, -25],
  [-12, -6, 20],
]

export default function DeepSpaceScene() {
  const blackHoleIndex = DEEP_SPACE.findIndex((o) => o.type === 'black-hole')
  const blackHolePos = POSITIONS[blackHoleIndex] || [0, 0, 0]

  return (
    <>
      <color attach="background" args={['#020408']} />
      <ambientLight intensity={0.15} />
      <DeepStars />

      {DEEP_SPACE.map((obj, i) => (
        <Nebula key={obj.id} obj={obj} position={POSITIONS[i] || [i * 15, 0, 0]} />
      ))}

      <Controls />
      <PostProcessing lensTarget={blackHolePos} lensRadius={1.5} />
    </>
  )
}
