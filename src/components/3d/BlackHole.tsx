import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simplex noise (Ashima/webgl-noise) — used by the accretion disk shader
const SIMPLEX_3D = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`

// Near-horizontal, with enough tilt to read as a disk rather than a flat ring
const DISK_TILT = Math.PI * 0.42

/** Turbulent, differentially-rotating accretion disk. */
function AccretionDisk({ radius, active }: { radius: number; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const inner = radius * 1.15
  const outer = radius * 4.0

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uInner: { value: inner },
        uOuter: { value: outer },
        uColorHot: { value: new THREE.Color(0xffffff) },
        uColorMid1: { value: new THREE.Color(0xff7733) },
        uColorMid2: { value: new THREE.Color(0xff4477) },
        uColorMid3: { value: new THREE.Color(0x7744ff) },
        uColorOuter: { value: new THREE.Color(0x4477ff) },
        uNoiseScale: { value: 2.5 },
        uFlowSpeed: { value: 0.22 },
        uDensity: { value: 1.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;
        void main() {
          vUv = uv;
          vRadius = length(position.xy);
          vAngle = atan(position.y, position.x);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uInner;
        uniform float uOuter;
        uniform vec3 uColorHot;
        uniform vec3 uColorMid1;
        uniform vec3 uColorMid2;
        uniform vec3 uColorMid3;
        uniform vec3 uColorOuter;
        uniform float uNoiseScale;
        uniform float uFlowSpeed;
        uniform float uDensity;

        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;

        ${SIMPLEX_3D}

        void main() {
          // 0 at the outer rim, 1 at the inner edge — hotter as you fall inward
          float nr = 1.0 - smoothstep(uInner, uOuter, vRadius);

          float spiral = vAngle * 3.0 - (1.0 / (nr + 0.1)) * 2.0;
          vec2 noiseUv = vec2(
            vUv.x + uTime * uFlowSpeed * (2.0 / (vRadius * 0.3 + 1.0)) + sin(spiral) * 0.1,
            vUv.y * 0.8 + cos(spiral) * 0.1
          );
          float n1 = snoise(vec3(noiseUv * uNoiseScale, uTime * 0.15));
          float n2 = snoise(vec3(noiseUv * uNoiseScale * 3.0 + 0.8, uTime * 0.22));
          float n3 = snoise(vec3(noiseUv * uNoiseScale * 6.0 + 1.5, uTime * 0.3));
          float noiseVal = (n1 * 0.45 + n2 * 0.35 + n3 * 0.2);
          noiseVal = (noiseVal + 1.0) * 0.5;

          vec3 color = uColorOuter;
          color = mix(color, uColorMid3, smoothstep(0.0, 0.25, nr));
          color = mix(color, uColorMid2, smoothstep(0.2, 0.55, nr));
          color = mix(color, uColorMid1, smoothstep(0.5, 0.75, nr));
          color = mix(color, uColorHot, smoothstep(0.7, 0.95, nr));
          color *= (0.5 + noiseVal);

          float brightness = nr * 2.4 + 0.45;
          brightness *= (0.3 + noiseVal * 1.9);
          brightness *= sin(uTime * 1.8 + nr * 12.0 + vAngle * 2.0) * 0.15 + 0.85;

          float alpha = uDensity * (0.2 + noiseVal * 0.9);
          alpha *= smoothstep(0.0, 0.15, nr);            // fade at inner edge
          alpha *= 1.0 - smoothstep(0.85, 1.0, nr);      // fade at outer rim
          alpha = clamp(alpha, 0.0, 1.0);

          gl_FragColor = vec4(color * brightness, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [inner, outer])

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uDensity.value = THREE.MathUtils.lerp(
      material.uniforms.uDensity.value,
      active ? 1.8 : 1.3,
      0.05,
    )
    if (meshRef.current) meshRef.current.rotation.z += delta * 0.02
  })

  return (
    <mesh ref={meshRef} rotation={[DISK_TILT, 0, 0]} material={material} renderOrder={1}>
      <ringGeometry args={[inner, outer, 220, 96]} />
    </mesh>
  )
}

/** Fresnel halo hugging the event horizon — photons grazing the sphere. */
function EventHorizonGlow({ radius, color, active }: { radius: number; color: string; active: boolean }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: new THREE.Vector3() },
        uGlowColor: { value: new THREE.Color(color) },
        uIntensity: { value: 0.4 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCameraPosition;
        uniform vec3 uGlowColor;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(uCameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.5);
          float pulse = sin(uTime * 2.5) * 0.15 + 0.85;
          gl_FragColor = vec4(uGlowColor * fresnel * pulse, fresnel * uIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })
  }, [color])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uCameraPosition.value.copy(state.camera.position)
    material.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      material.uniforms.uIntensity.value,
      active ? 0.75 : 0.4,
      0.06,
    )
  })

  return (
    <mesh material={material} renderOrder={2}>
      <sphereGeometry args={[radius * 1.06, 64, 32]} />
    </mesh>
  )
}

export interface BlackHoleProps {
  radius: number
  glowColor: string
  active: boolean
  selected: boolean
  onClick: (e: any) => void
  onPointerEnter: (e: any) => void
  onPointerLeave: (e: any) => void
}

export default function BlackHole({
  radius,
  glowColor,
  active,
  selected,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: BlackHoleProps) {
  return (
    <group>
      {/* Event horizon — pure black, occludes the far side of the disk */}
      <mesh
        renderOrder={0}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <sphereGeometry args={[radius, 64, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <EventHorizonGlow radius={radius} color={glowColor} active={active} />
      <AccretionDisk radius={radius} active={active} />

      {/* Light spill onto neighbouring objects */}
      <pointLight color={glowColor} intensity={active ? 1.4 : 0.6} distance={radius * 18} />

      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 5.2, 0.05, 8, 96]} />
          <meshBasicMaterial color="#4d9ef7" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}
