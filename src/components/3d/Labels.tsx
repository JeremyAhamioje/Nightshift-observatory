import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANETS } from '../../data/astronomy'
import { useAppStore } from '../../store/app'

// This component projects 3D positions to 2D screen coords for HTML labels
export function PlanetLabels({ positions }: { positions: Map<string, THREE.Vector3> }) {
  const { showLabels, selectedId, setSelected, hoveredId } = useAppStore()
  const { camera, size } = useThree()
  const labelsRef = useRef<Map<string, { x: number; y: number; visible: boolean }>>(new Map())

  useFrame(() => {
    positions.forEach((worldPos, id) => {
      const projected = worldPos.clone().project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      labelsRef.current.set(id, { x, y, visible: projected.z < 1 })
    })
  })

  if (!showLabels) return null
  return null  // Labels rendered via DOM overlay in main App
}
