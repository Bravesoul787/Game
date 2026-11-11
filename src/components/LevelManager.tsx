import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { useGameStore } from '../store/gameStore'

export type ObstacleType = 'ROCK' | 'BARRIER' | 'DRAGON_BALL' | 'NIMBUS' | 'SENZU'

export interface ObstacleData {
  id: number
  type: ObstacleType
  lane: number // -1, 0, 1
  z: number
  active: boolean
}

interface LevelManagerProps {
  obstacles: ObstacleData[]
  setObstacles: React.Dispatch<React.SetStateAction<ObstacleData[]>>
}

const LANE_WIDTH = 3

export function LevelManager({ obstacles, setObstacles }: LevelManagerProps) {
  const speed = useGameStore((state) => state.speed)
  const gameState = useGameStore((state) => state.gameState)

  const spawnTimer = useRef(0)
  const nextSpawnTime = useRef(1) // Seconds until next spawn

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    // Move obstacles
    const moveDist = speed * delta
    setObstacles(prev => {
      let changed = false
      const next = prev.map(obs => {
        if (!obs.active) return obs
        const newZ = obs.z + moveDist
        if (newZ > 10) { // Passed camera
          changed = true
          return { ...obs, active: false }
        }
        return { ...obs, z: newZ }
      })

      // Spawn new
      spawnTimer.current += delta
      if (spawnTimer.current > nextSpawnTime.current) {
        spawnTimer.current = 0
        // Spawn rate scales slightly with speed
        nextSpawnTime.current = Math.max(0.5, 2.0 - (speed / 30))

        // Find inactive to recycle
        const inactiveIdx = next.findIndex(o => !o.active)
        if (inactiveIdx !== -1) {
          const typeRoll = Math.random()
          let type: ObstacleType = 'ROCK'
          if (typeRoll > 0.95) type = 'NIMBUS'
          else if (typeRoll > 0.9) type = 'SENZU'
          else if (typeRoll > 0.7) type = 'DRAGON_BALL'
          else if (typeRoll > 0.35) type = 'BARRIER'

          const lane = Math.floor(Math.random() * 3) - 1

          next[inactiveIdx] = {
            id: next[inactiveIdx].id,
            type,
            lane,
            z: -100, // Spawn far ahead
            active: true
          }
        }
        changed = true
      }

      return changed ? next : prev
    })
  })

  return (
    <group>
      {obstacles.map((obs) => {
        if (!obs.active) return null

        const x = obs.lane * LANE_WIDTH

        if (obs.type === 'ROCK') {
          return (
            <mesh key={obs.id} position={[x, 0.5, obs.z]}>
              <dodecahedronGeometry args={[0.8]} />
              <meshStandardMaterial color="#888888" roughness={0.8} />
            </mesh>
          )
        }

        if (obs.type === 'BARRIER') {
          return (
            <group key={obs.id} position={[x, 1.5, obs.z]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3, 0.5, 0.2]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              <mesh position={[-1.2, -0.75, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              <mesh position={[1.2, -0.75, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
            </group>
          )
        }

        if (obs.type === 'DRAGON_BALL') {
          return (
            <mesh key={obs.id} position={[x, 1, obs.z]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#ffa500" emissive="#ff6600" emissiveIntensity={0.5} />
            </mesh>
          )
        }

        if (obs.type === 'NIMBUS') {
          return (
            <mesh key={obs.id} position={[x, 1, obs.z]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
            </mesh>
          )
        }

        if (obs.type === 'SENZU') {
          return (
            <mesh key={obs.id} position={[x, 1, obs.z]}>
               <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
          )
        }

        return null
      })}
    </group>
  )
}
