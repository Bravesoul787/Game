import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function World() {
  const gameState = useGameStore((state) => state.gameState)
  const speed = useGameStore((state) => state.speed)

  const groundRef1 = useRef<THREE.Mesh>(null)
  const groundRef2 = useRef<THREE.Mesh>(null)

  const SCENE_LENGTH = 200

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    const moveDist = speed * delta

    if (groundRef1.current && groundRef2.current) {
      groundRef1.current.position.z += moveDist
      groundRef2.current.position.z += moveDist

      if (groundRef1.current.position.z > SCENE_LENGTH) {
        groundRef1.current.position.z = groundRef2.current.position.z - SCENE_LENGTH
      }
      if (groundRef2.current.position.z > SCENE_LENGTH) {
        groundRef2.current.position.z = groundRef1.current.position.z - SCENE_LENGTH
      }
    }
  })

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
      />

      {/* Sky and Atmospheric Fog */}
      <fog attach="fog" args={['#87CEEB', 30, 100]} />

      {/* Ground 1 */}
      <mesh
        ref={groundRef1}
        position={[0, 0, -SCENE_LENGTH / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, SCENE_LENGTH]} />
        <meshStandardMaterial color="#4ade80" /> {/* Grass green */}

        {/* Path / Dirt track */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[10, SCENE_LENGTH]} />
          <meshStandardMaterial color="#c2b280" />
        </mesh>
      </mesh>

      {/* Ground 2 */}
      <mesh
        ref={groundRef2}
        position={[0, 0, -SCENE_LENGTH * 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, SCENE_LENGTH]} />
        <meshStandardMaterial color="#4ade80" />

        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[10, SCENE_LENGTH]} />
          <meshStandardMaterial color="#c2b280" />
        </mesh>
      </mesh>

    </group>
  )
}
