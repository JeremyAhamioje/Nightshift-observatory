import * as THREE from 'three'

/**
 * Live world positions of focusable scene objects, keyed by id. Bodies write
 * their current position every frame (or once, if static); the camera controller
 * reads it to fly to — and lock onto — whatever is selected, even as it moves.
 *
 * A plain module-level map keeps these high-frequency updates out of React state.
 */
export const focusPositions = new Map<string, THREE.Vector3>()

export function registerFocus(id: string, pos: THREE.Vector3) {
  const existing = focusPositions.get(id)
  if (existing) existing.copy(pos)
  else focusPositions.set(id, pos.clone())
}
