import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

/**
 * Screen-space approximation of gravitational lensing: pixels are pulled toward
 * the black hole's projected position, with a slight per-channel offset so the
 * rim picks up chromatic dispersion.
 */
const lensingShader = {
  uniforms: {
    tDiffuse: { value: null },
    blackHoleScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
    lensingStrength: { value: 0.0 },
    lensingRadius: { value: 0.3 },
    aspectRatio: { value: 1 },
    chromaticAberration: { value: 0.005 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 blackHoleScreenPos;
    uniform float lensingStrength;
    uniform float lensingRadius;
    uniform float aspectRatio;
    uniform float chromaticAberration;
    varying vec2 vUv;

    void main() {
      vec2 toCenter = vUv - blackHoleScreenPos;
      toCenter.x *= aspectRatio;
      float dist = length(toCenter);

      float amount = lensingStrength / (dist * dist + 0.003);
      amount = clamp(amount, 0.0, 0.7);
      amount *= smoothstep(lensingRadius, lensingRadius * 0.3, dist);

      vec2 offset = normalize(toCenter + 1e-6) * amount;
      offset.x /= aspectRatio;

      float r = texture2D(tDiffuse, vUv - offset * (1.0 + chromaticAberration)).r;
      float g = texture2D(tDiffuse, vUv - offset).g;
      float b = texture2D(tDiffuse, vUv - offset * (1.0 - chromaticAberration)).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
}

interface Props {
  /** World-space position of the black hole to lens around. */
  lensTarget: [number, number, number]
  /** Event horizon radius, used to scale the lensing to apparent size. */
  lensRadius: number
}

export default function PostProcessing({ lensTarget, lensRadius }: Props) {
  const { gl, scene, camera, size } = useThree()

  const [composer, bloomPass, lensingPass] = useMemo(() => {
    const c = new EffectComposer(gl)
    c.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.55, 0.65, 0.8)
    c.addPass(bloom)
    const lens = new ShaderPass(lensingShader)
    c.addPass(lens)
    c.addPass(new OutputPass())
    return [c, bloom, lens] as const
  }, [gl, scene, camera])

  useEffect(() => () => composer.dispose(), [composer])

  useEffect(() => {
    composer.setSize(size.width, size.height)
    composer.setPixelRatio(gl.getPixelRatio())
    bloomPass.resolution.set(size.width, size.height)
    lensingPass.uniforms.aspectRatio.value = size.width / size.height
  }, [composer, bloomPass, lensingPass, size, gl])

  const target = useMemo(() => new THREE.Vector3(...lensTarget), [lensTarget])
  const projected = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    projected.current.copy(target).project(camera)

    const behindCamera = projected.current.z > 1
    if (behindCamera) {
      lensingPass.uniforms.lensingStrength.value = 0
    } else {
      // Scale the effect with how large the hole actually appears on screen,
      // so it doesn't smear the whole viewport when the camera flies in close.
      const dist = camera.position.distanceTo(target)
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 55
      const screenFraction = lensRadius / dist / Math.tan(THREE.MathUtils.degToRad(fov) / 2)
      lensingPass.uniforms.lensingStrength.value = Math.min(screenFraction * screenFraction * 2.2, 0.15)
      lensingPass.uniforms.lensingRadius.value = THREE.MathUtils.clamp(screenFraction * 6, 0.05, 0.5)
      lensingPass.uniforms.blackHoleScreenPos.value.set(
        (projected.current.x + 1) / 2,
        (projected.current.y + 1) / 2,
      )
    }

    composer.render(delta)
  }, 1)

  return null
}
