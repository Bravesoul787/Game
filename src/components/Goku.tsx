import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

interface GokuProps {
  position: [number, number, number]
  isJumping: boolean
  isSliding: boolean
}

export function Goku({ position, isJumping, isSliding }: GokuProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)

  const gameState = useGameStore((state) => state.gameState)

  // Animation state
  const [runTime, setRunTime] = useState(0)

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    setRunTime((prev) => prev + delta * 15)

    // Smooth lane transition
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        position[0],
        0.15
      )

      // Jump/Slide height transition
      const targetY = isJumping ? position[1] + 2 : (isSliding ? position[1] - 0.5 : position[1])
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.15
      )

      // Rotation for slide
      const targetRotX = isSliding ? Math.PI / 2 : 0
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.2
      )
    }

    // Running animation
    if (!isJumping && !isSliding) {
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(runTime) * 0.8
        rightLegRef.current.rotation.x = Math.sin(runTime + Math.PI) * 0.8
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(runTime + Math.PI) * 0.8
        rightArmRef.current.rotation.x = Math.sin(runTime) * 0.8
      }
    } else if (isJumping) {
      // Jump pose
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -0.5
        rightLegRef.current.rotation.x = 0.2
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 2
        rightArmRef.current.rotation.x = -Math.PI / 2
      }
    } else if (isSliding) {
       // Slide pose
       if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0
        rightLegRef.current.rotation.x = 0
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 2
        rightArmRef.current.rotation.x = -Math.PI / 2
      }
    }
  })

  // Colors
  const skinColor = "#ffcd94"
  const giColor = "#ff7b00"
  const blueColor = "#0000ff"
  const hairColor = "#111111"

  return (
    <group ref={groupRef} position={[0, position[1], position[2]]}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 16]} />
        <meshStandardMaterial color={giColor} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.15, 16]} />
        <meshStandardMaterial color={blueColor} />
      </mesh>

      {/* Head */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Hair - Spiky */}
        <mesh position={[0, 0.3, -0.1]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.4, 0.8, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh position={[0.2, 0.2, 0]} rotation={[0.5, 0, -0.5]}>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh position={[-0.2, 0.2, 0]} rotation={[0.5, 0, 0.5]}>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh position={[0, 0.2, 0.2]} rotation={[-0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 8]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.4, 1.3, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.3, 8]} />
          <meshStandardMaterial color={giColor} />
        </mesh>
        {/* Arm */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Wristband */}
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.15, 8]} />
          <meshStandardMaterial color={blueColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.4, 1.3, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.3, 8]} />
          <meshStandardMaterial color={giColor} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.15, 8]} />
          <meshStandardMaterial color={blueColor} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.6, 8]} />
          <meshStandardMaterial color={giColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.18, 0.15, 0.3]} />
          <meshStandardMaterial color={blueColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.6, 8]} />
          <meshStandardMaterial color={giColor} />
        </mesh>
        <mesh position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.18, 0.15, 0.3]} />
          <meshStandardMaterial color={blueColor} />
        </mesh>
      </group>

      {/* Power Pole on Back */}
      <mesh position={[0, 1, -0.35]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.6, -0.3]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

    </group>
  )
}
