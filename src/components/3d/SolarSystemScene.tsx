import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLANETS, SPACECRAFT, type Planet } from '../../data/astronomy'
import { useAppStore } from '../../store/app'
import { registerFocus, focusPositions } from './focusRegistry'
import SpacecraftFleet from './Spacecraft'

const ORIGIN = new THREE.Vector3(0, 0, 0)
const OVERVIEW_CAM = new THREE.Vector3(0, 30, 80)

// How far the camera parks from a focused object, and whether it should keep the
// orbit pivot locked to that object's live position afterwards.
function focusConfig(id: string): { radius: number; lock: boolean; overrideCam?: THREE.Vector3; lookAtOrigin?: boolean } {
  if (id === 'asteroid-belt') return { radius: 0, lock: false, overrideCam: new THREE.Vector3(0, 16, 42), lookAtOrigin: true }
  const planet = PLANETS.find(p => p.id === id)
  if (planet) return { radius: planet.radius * 6 + 6, lock: true }
  if (id === 'moon') return { radius: 3.2, lock: true }
  const craft = SPACECRAFT.find(s => s.id === id)
  if (craft) return { radius: craft.focusRadius, lock: true }
  return { radius: 10, lock: true }
}

// ── Orbit Controls + selection focus ───────────────────────────────────────────
// Owns OrbitControls plus a "fly to and lock onto" animation. Selecting an object
// eases the camera to a vantage beside it and keeps the orbit pivot pinned to its
// live position (so a moving planet stays framed). Grabbing the controls cancels
// the fly-in but keeps the lock; zoom/orbit then work freely around the object.
function Controls() {
  const { camera, gl } = useThree()
  const { selectedId } = useAppStore()
  const ref = useRef<OrbitControls | null>(null)
  const focusing = useRef(false)
  const lockId = useRef<string | null>(null)
  const staticTarget = useRef(new THREE.Vector3(0, 0, 0))
  const camTarget = useRef(OVERVIEW_CAM.clone())

  useEffect(() => {
    const ctrl = new OrbitControls(camera, gl.domElement)
    ctrl.enableDamping = true
    ctrl.dampingFactor = 0.06
    ctrl.minDistance = 4
    ctrl.maxDistance = 120
    ctrl.enablePan = true
    ctrl.panSpeed = 0.5
    ctrl.rotateSpeed = 0.5
    ctrl.zoomSpeed = 0.8
    ref.current = ctrl
    // Touching the controls ends the fly-in so we never fight the user's input.
    const cancelFocus = () => { focusing.current = false }
    ctrl.addEventListener('start', cancelFocus)
    return () => { ctrl.removeEventListener('start', cancelFocus); ctrl.dispose() }
  }, [camera, gl])

  // Is an object already comfortably on screen at a sensible distance? If so we
  // just lock onto it in place — no camera move — so clicking something you can
  // already see never yanks the view to a canned angle.
  const isWellFramed = (pos: THREE.Vector3) => {
    const ndc = pos.clone().project(camera)
    const onScreen = Math.abs(ndc.x) < 0.85 && Math.abs(ndc.y) < 0.85 && ndc.z < 1
    const dist = camera.position.distanceTo(pos)
    return onScreen && dist > 6 && dist < 80
  }

  // On selection change, decide whether to fly the camera or just re-lock in place.
  useEffect(() => {
    const ctrl = ref.current
    if (!selectedId) {
      lockId.current = null
      staticTarget.current.copy(ORIGIN)
      // Only fly back to the overview if we're currently way out (e.g. after
      // visiting a distant spacecraft); otherwise just hand the pivot back.
      if (camera.position.distanceTo(ORIGIN) > 95) {
        camTarget.current.copy(OVERVIEW_CAM)
        focusing.current = true
      } else {
        focusing.current = false
      }
      if (ctrl) ctrl.enablePan = true
      return
    }

    const cfg = focusConfig(selectedId)
    const pos = focusPositions.get(selectedId)?.clone() ?? ORIGIN.clone()

    if (cfg.overrideCam) {
      lockId.current = null
      staticTarget.current.copy(cfg.lookAtOrigin ? ORIGIN : pos)
      camTarget.current.copy(cfg.overrideCam)
      focusing.current = true
    } else {
      lockId.current = cfg.lock ? selectedId : null
      staticTarget.current.copy(pos)
      if (isWellFramed(pos)) {
        // Already visible — lock on without moving the camera.
        focusing.current = false
      } else {
        // Off-screen or too far/near — fly to a 3/4 vantage beside it.
        const dir = pos.lengthSq() > 0.01 ? pos.clone().normalize() : new THREE.Vector3(0.6, 0.35, 0.75).normalize()
        camTarget.current.copy(pos).addScaledVector(dir, cfg.radius).add(new THREE.Vector3(0, cfg.radius * 0.45, 0))
        focusing.current = true
      }
    }
    // Panning would fight the lock, so disable it while an object is focused.
    if (ctrl) ctrl.enablePan = false
  }, [selectedId, camera])

  const followDelta = useRef(new THREE.Vector3())

  useFrame(() => {
    const ctrl = ref.current
    if (!ctrl) return

    // Desired orbit pivot: the locked object's live position, else a static point.
    const desired = lockId.current ? (focusPositions.get(lockId.current) ?? staticTarget.current) : staticTarget.current

    if (focusing.current) {
      // Fly-in: ease the pivot and the camera toward their goals independently.
      ctrl.target.lerp(desired, 0.06)
      camera.position.lerp(camTarget.current, 0.06)
      if (camera.position.distanceTo(camTarget.current) < 0.5) focusing.current = false
    } else {
      // Lock-follow: translate the pivot AND the camera by the SAME delta so the
      // orbit offset (distance + angle) is preserved exactly. Moving only the
      // target would change the radius and make the object drift/yank away.
      followDelta.current.copy(desired).sub(ctrl.target)
      ctrl.target.add(followDelta.current)
      camera.position.add(followDelta.current)
    }

    ctrl.update()
  })
  return null
}

// ── Star field ────────────────────────────────────────────────────────────────
function Starfield() {
  const geo = useMemo(() => {
    const N = 12000
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const sz = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 300 + Math.random() * 200
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      // color: mostly white/blue, some warm
      const warm = Math.random() < 0.12
      const b = 0.55 + Math.random() * 0.45
      col[i*3]   = warm ? b * 1.0 : b * 0.88
      col[i*3+1] = warm ? b * 0.82 : b * 0.93
      col[i*3+2] = warm ? b * 0.5 : b
      sz[i] = 0.3 + Math.random() * 1.2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.5} vertexColors sizeAttenuation transparent opacity={0.85} fog={false} />
    </points>
  )
}

// ── Procedural planet texture ─────────────────────────────────────────────────
function usePlanetTexture(planet: Planet): THREE.Texture {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')!
    const baseColor = new THREE.Color(planet.color)

    // Background
    ctx.fillStyle = planet.color
    ctx.fillRect(0, 0, size, size)

    if (planet.id === 'sun') {
      // Sun: radial gradient with corona
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      grad.addColorStop(0, '#fff8e0')
      grad.addColorStop(0.3, '#ffd060')
      grad.addColorStop(0.7, '#ff9020')
      grad.addColorStop(1, '#cc4400')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, size)
      // Granulation noise
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * size, y = Math.random() * size
        const r = 3 + Math.random() * 12
        const g2 = ctx.createRadialGradient(x,y,0,x,y,r)
        g2.addColorStop(0, 'rgba(255,240,180,0.15)')
        g2.addColorStop(1, 'rgba(255,140,0,0)')
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill()
      }
    } else if (planet.id === 'earth') {
      // Earth: blue ocean base
      ctx.fillStyle = '#1a6699'; ctx.fillRect(0, 0, size, size)
      // Continents (rough)
      ctx.fillStyle = '#3a7a3a'
      const continents = [
        {x:200,y:180,rx:100,ry:70}, {x:340,y:200,rx:60,ry:50},
        {x:260,y:300,rx:80,ry:60}, {x:140,y:280,rx:55,ry:45},
        {x:420,y:320,rx:50,ry:40}, {x:80,y:160,rx:40,ry:30},
      ]
      continents.forEach(c => {
        ctx.beginPath(); ctx.ellipse(c.x,c.y,c.rx,c.ry,0,0,Math.PI*2); ctx.fill()
      })
      // Cloud layer
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      for (let i = 0; i < 40; i++) {
        const x = Math.random()*size, y = Math.random()*size, r = 20+Math.random()*60
        const cg = ctx.createRadialGradient(x,y,0,x,y,r)
        cg.addColorStop(0,'rgba(255,255,255,0.4)'); cg.addColorStop(1,'rgba(255,255,255,0)')
        ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill()
      }
    } else if (planet.id === 'mars') {
      // Mars: rusty red with darker basins
      const mg = ctx.createLinearGradient(0,0,size,size)
      mg.addColorStop(0,'#c84820'); mg.addColorStop(0.5,'#a83010'); mg.addColorStop(1,'#d45828')
      ctx.fillStyle=mg; ctx.fillRect(0,0,size,size)
      // Dark patches (basins)
      ctx.fillStyle='rgba(60,15,5,0.4)'
      for (let i=0;i<8;i++){
        const x=Math.random()*size,y=Math.random()*size,r=20+Math.random()*80
        ctx.beginPath();ctx.ellipse(x,y,r,r*0.6,Math.random()*Math.PI,0,Math.PI*2);ctx.fill()
      }
    } else if (planet.id === 'jupiter') {
      // Jupiter: horizontal bands
      const bands = ['#c8966a','#e8c4a0','#a87040','#d4a870','#b88060','#dcc8a0','#c0804a','#e8d0b0']
      const bh = size / bands.length
      bands.forEach((c,i) => { ctx.fillStyle=c; ctx.fillRect(0,i*bh,size,bh) })
      // Great Red Spot
      const grs = ctx.createRadialGradient(320,240,0,320,240,45)
      grs.addColorStop(0,'rgba(160,50,30,0.9)'); grs.addColorStop(0.6,'rgba(180,80,50,0.6)'); grs.addColorStop(1,'transparent')
      ctx.fillStyle=grs; ctx.beginPath(); ctx.ellipse(320,240,55,35,0,0,Math.PI*2); ctx.fill()
    } else if (planet.id === 'saturn') {
      // Saturn: pale gold bands
      const sbands = ['#d4c080','#c8b060','#e4d4a0','#c0a858','#d8c888','#c4b070']
      const sbh = size / sbands.length
      sbands.forEach((c,i) => { ctx.fillStyle=c; ctx.fillRect(0,i*sbh,size,sbh) })
    } else if (planet.id === 'uranus' || planet.id === 'neptune') {
      // Ice giants: smooth gradient
      const ug = ctx.createRadialGradient(size*0.35,size*0.35,0,size/2,size/2,size*0.6)
      if (planet.id === 'uranus') {
        ug.addColorStop(0,'#b0f0f0'); ug.addColorStop(1,'#4ab8b8')
      } else {
        ug.addColorStop(0,'#5080e0'); ug.addColorStop(1,'#1828a0')
      }
      ctx.fillStyle=ug; ctx.fillRect(0,0,size,size)
    } else {
      // Generic: sphere shading
      const gg = ctx.createRadialGradient(size*0.35,size*0.3,0,size/2,size/2,size*0.55)
      gg.addColorStop(0, lightenHex(planet.color, 0.3))
      gg.addColorStop(0.6, planet.color)
      gg.addColorStop(1, darkenHex(planet.color, 0.4))
      ctx.fillStyle=gg; ctx.fillRect(0,0,size,size)
    }

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planet.id])
}

function lightenHex(hex: string, amt: number) {
  const c = new THREE.Color(hex)
  return `rgb(${Math.min(255,Math.round(c.r*255*(1+amt)))},${Math.min(255,Math.round(c.g*255*(1+amt)))},${Math.min(255,Math.round(c.b*255*(1+amt)))})`
}
function darkenHex(hex: string, amt: number) {
  const c = new THREE.Color(hex)
  return `rgb(${Math.round(c.r*255*(1-amt))},${Math.round(c.g*255*(1-amt))},${Math.round(c.b*255*(1-amt))})`
}

// ── Sun with animated glow ────────────────────────────────────────────────────
function Sun({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const innerHaloRef = useRef<THREE.Mesh>(null)
  const tex = usePlanetTexture(planet)
  const { selectedId, setSelected, setHovered } = useAppStore()
  const isSelected = selectedId === 'sun'

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
    if (haloRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
      haloRef.current.scale.setScalar(s)
      ;(haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
    if (innerHaloRef.current) {
      const s2 = 1 + Math.sin(state.clock.elapsedTime * 1.2 + 1) * 0.03
      innerHaloRef.current.scale.setScalar(s2)
    }
  })

  return (
    <group>
      {/* Corona layers */}
      <mesh>
        <sphereGeometry args={[planet.radius * 2.8, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.03} depthWrite={false} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[planet.radius * 1.8, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={innerHaloRef}>
        <sphereGeometry args={[planet.radius * 1.3, 32, 32]} />
        <meshBasicMaterial color="#ffdd88" transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Sun body */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : 'sun') }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered('sun') }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
      >
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshBasicMaterial map={tex} />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.18, 32, 32]} />
          <meshBasicMaterial color="#4d9ef7" transparent opacity={0.12} depthWrite={false} wireframe />
        </mesh>
      )}

      {/* Point light from sun */}
      <pointLight color="#fff8e0" intensity={3} distance={500} decay={1} />
    </group>
  )
}

// ── Saturn rings ─────────────────────────────────────────────────────────────
function SaturnRings({ radius }: { radius: number }) {
  const geo = useMemo(() => {
    const inner = radius * 1.3
    const outer = radius * 2.4
    const segments = 128
    const positions = new Float32Array(segments * 2 * 3 * 2)
    // Build ring as thin triangle strip
    let idx = 0
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const cos = Math.cos(angle), sin = Math.sin(angle)
      // inner vertex
      positions[idx++] = cos * inner; positions[idx++] = 0; positions[idx++] = sin * inner
      // outer vertex
      positions[idx++] = cos * outer; positions[idx++] = 0; positions[idx++] = sin * outer
    }
    const g = new THREE.BufferGeometry()
    // Build indices for triangle strip
    const indices: number[] = []
    for (let i = 0; i < segments; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3
      indices.push(a, b, c, b, d, c)
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, (segments+1)*2*3), 3))
    g.setIndex(indices)
    return g
  }, [radius])

  return (
    <mesh geometry={geo} rotation={[Math.PI * 0.08, 0, 0]}>
      <meshBasicMaterial
        color="#c8b878"
        transparent
        opacity={0.55}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── Orbit ring ────────────────────────────────────────────────────────────────
function OrbitRing({ radius }: { radius: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const N = 180
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius])

  return (
    <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#1e3251', transparent: true, opacity: 0.5 }))} />
  )
}

// ── Earth's Moon ────────────────────────────────────────────────────────────────
// Rendered as a child of Earth's group so it orbits along with the planet. It
// reports its live world position so the camera can fly to / lock onto it.
function Moon({ earthRadius }: { earthRadius: number }) {
  const orbitRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const { selectedId, hoveredId, setSelected, setHovered, isPlaying, timeScale } = useAppStore()
  const isSelected = selectedId === 'moon'
  const isHovered = hoveredId === 'moon'
  const active = isSelected || isHovered
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const worldPos = useRef(new THREE.Vector3())

  const orbitR = earthRadius * 2.8
  const moonR = Math.max(0.24, earthRadius * 0.27)

  useFrame((_, delta) => {
    // Orbit a little always so it reads as a moon; faster with the sim clock.
    const rate = isPlaying ? 0.5 * Math.min(timeScale, 200) * 0.02 : 0.22
    angleRef.current += delta * rate
    if (orbitRef.current) {
      orbitRef.current.position.set(Math.cos(angleRef.current) * orbitR, 0, Math.sin(angleRef.current) * orbitR)
    }
    if (bodyRef.current) {
      bodyRef.current.getWorldPosition(worldPos.current)
      registerFocus('moon', worldPos.current)
      bodyRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      {/* Faint orbit ring around Earth */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitR - 0.015, orbitR + 0.015, 64]} />
        <meshBasicMaterial color="#6a7a90" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <group ref={orbitRef}>
        {active && (
          <mesh>
            <sphereGeometry args={[moonR * 1.7, 16, 16]} />
            <meshBasicMaterial color={isSelected ? '#4d9ef7' : '#ffffff'} transparent opacity={isSelected ? 0.16 : 0.06} depthWrite={false} />
          </mesh>
        )}
        <mesh
          ref={bodyRef}
          onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : 'moon') }}
          onPointerEnter={(e) => { e.stopPropagation(); setHovered('moon') }}
          onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
        >
          <sphereGeometry args={[moonR, 24, 24]} />
          <meshStandardMaterial color="#b7b3aa" roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  )
}

// ── Planet body ───────────────────────────────────────────────────────────────
function PlanetBody({ planet, angle }: { planet: Planet; angle: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const tex = usePlanetTexture(planet)
  const { selectedId, hoveredId, setSelected, setHovered, isPlaying, timeScale, simDate, setSimDate } = useAppStore()
  const isSelected = selectedId === planet.id
  const isHovered = hoveredId === planet.id
  const angleRef = useRef(angle)

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return

    // Orbit
    if (isPlaying && planet.orbitRadius > 0) {
      const speed = (1 / (planet.orbitPeriod * 365)) * timeScale * delta * 60
      angleRef.current += speed * 0.008
      setSimDate(new Date(simDate.getTime() + delta * timeScale * 86400000))
    }

    const x = Math.cos(angleRef.current) * planet.orbitRadius
    const z = Math.sin(angleRef.current) * planet.orbitRadius
    groupRef.current.position.set(x, 0, z)
    registerFocus(planet.id, groupRef.current.position)

    // Rotation
    const rotSpeed = planet.rotationPeriod !== 0 ? (1 / Math.abs(planet.rotationPeriod)) * Math.sign(planet.rotationPeriod) * delta * 2 : 0
    meshRef.current.rotation.y += rotSpeed
  })

  const x = Math.cos(angle) * planet.orbitRadius
  const z = Math.sin(angle) * planet.orbitRadius

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {planet.id === 'saturn' && <SaturnRings radius={planet.radius} />}
      {planet.id === 'earth' && <Moon earthRadius={planet.radius} />}

      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : planet.id) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(planet.id) }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(null) }}
      >
        <sphereGeometry args={[planet.radius, 48, 48]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Hover glow */}
      {(isHovered || isSelected) && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.25, 24, 24]} />
          <meshBasicMaterial
            color={isSelected ? '#4d9ef7' : '#ffffff'}
            transparent
            opacity={isSelected ? 0.08 : 0.04}
            depthWrite={false}
          />
        </mesh>
      )}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.35, 24, 24]} />
          <meshBasicMaterial color="#4d9ef7" transparent opacity={0.15} depthWrite={false} wireframe />
        </mesh>
      )}
    </group>
  )
}

// ── Asteroid belt ───────────────────────────────────────────────────────────────
// A sparse scatter of rocks between Mars (r=15) and Jupiter (r=22). Instanced so
// it's a single draw call regardless of count.
function AsteroidBelt({ inner = 16.5, outer = 20, count = 48 }: { inner?: number; outer?: number; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { isPlaying, timeScale } = useAppStore()

  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.1, 0), [])
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8a7c6a', roughness: 1, metalness: 0, flatShading: true }),
    [],
  )

  const rocks = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: inner + Math.random() * (outer - inner),
      y: (Math.random() - 0.5) * 1.1,
      scale: 0.5 + Math.random() * 1.7,
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
    }))
  }, [count, inner, outer])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    rocks.forEach((r, i) => {
      dummy.position.set(Math.cos(r.angle) * r.radius, r.y, Math.sin(r.angle) * r.radius)
      dummy.rotation.copy(r.rot)
      dummy.scale.setScalar(r.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [rocks])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Drift very slowly; speed up with the sim clock when it's running.
    const rate = isPlaying ? 0.02 * Math.min(timeScale, 200) * 0.05 : 0.01
    groupRef.current.rotation.y += delta * rate
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geo, mat, count]} />
    </group>
  )
}

// ── Main Scene ────────────────────────────────────────────────────────────────
export default function SolarSystemScene() {
  const { showOrbits } = useAppStore()

  const planetAngles = useMemo(() =>
    PLANETS.filter(p => p.id !== 'sun').map(() => Math.random() * Math.PI * 2),
  [])

  const sun = PLANETS[0]
  const planets = PLANETS.filter(p => p.id !== 'sun')

  return (
    <>
      <color attach="background" args={['#04060a']} />
      <ambientLight intensity={0.06} />
      <Starfield />

      <Sun planet={sun} />

      {showOrbits && planets.map(p => (
        <OrbitRing key={`orbit-${p.id}`} radius={p.orbitRadius} />
      ))}

      {planets.map((p, i) => (
        <PlanetBody key={p.id} planet={p} angle={planetAngles[i]} />
      ))}

      <AsteroidBelt />
      <SpacecraftFleet />

      <Controls />
    </>
  )
}
