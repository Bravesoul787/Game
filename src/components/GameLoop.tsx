import { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { Goku } from './Goku'
import { World } from './World'
import { LevelManager, type ObstacleData } from './LevelManager'


const LANE_WIDTH = 3
const INITIAL_OBSTACLES: ObstacleData[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  type: 'ROCK',
  lane: 0,
  z: 10,
  active: false
}))

export function GameLoop() {
  const { gameState, endGame, addScore, addDistance, collectDragonBall, increaseSpeed, setPowerUp, activePowerUp } = useGameStore()

  const [lane, setLane] = useState(0) // -1, 0, 1
  const [isJumping, setIsJumping] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [obstacles, setObstacles] = useState<ObstacleData[]>(INITIAL_OBSTACLES)

  const jumpTimer = useRef(0)
  const slideTimer = useRef(0)
  const powerUpTimer = useRef(0)

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane(l => Math.max(-1, l - 1))
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane(l => Math.min(1, l + 1))
      }
      if ((e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') && !isJumping && !isSliding) {
        setIsJumping(true)
        jumpTimer.current = 0
      }
      if ((e.key === 'ArrowDown' || e.key === 's') && !isJumping && !isSliding) {
        setIsSliding(true)
        slideTimer.current = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, isJumping, isSliding])

  // Touch Handling for Mobile
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState !== 'PLAYING') return
      const touchEndX = e.changedTouches[0].screenX
      const touchEndY = e.changedTouches[0].screenY

      const dx = touchEndX - touchStartX
      const dy = touchEndY - touchStartY

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 30) setLane(l => Math.min(1, l + 1))
        else if (dx < -30) setLane(l => Math.max(-1, l - 1))
      } else {
        // Vertical swipe
        if (dy < -30 && !isJumping && !isSliding) {
          setIsJumping(true)
          jumpTimer.current = 0
        } else if (dy > 30 && !isJumping && !isSliding) {
          setIsSliding(true)
          slideTimer.current = 0
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gameState, isJumping, isSliding])

  // Reset obstacles on new game
  useEffect(() => {
    if (gameState === 'PLAYING') {
      setObstacles(INITIAL_OBSTACLES)
      setLane(0)
      setIsJumping(false)
      setIsSliding(false)
    }
  }, [gameState])

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    // Update Timers
    if (isJumping) {
      jumpTimer.current += delta
      if (jumpTimer.current > 0.8) setIsJumping(false)
    }
    if (isSliding) {
      slideTimer.current += delta
      if (slideTimer.current > 0.8) setIsSliding(false)
    }
    if (activePowerUp) {
      powerUpTimer.current += delta
      if (powerUpTimer.current > 5) setPowerUp(null)
    }

    // Score & Distance & Speed
    addDistance(delta * 10)
    addScore(delta * 5)
    increaseSpeed(delta * 0.1)

    // Collision Detection

    const playerZ = 0 // Player stays at Z=0 relative to camera view roughly

    setObstacles(prev => {
      let hit = false
      const next = prev.map(obs => {
        if (!obs.active) return obs

        // Simple AABB collision
        const inLane = obs.lane === lane
        const zDist = Math.abs(obs.z - playerZ)
        const colliding = inLane && zDist < 1.0

        if (colliding) {
          if (obs.type === 'DRAGON_BALL') {
            collectDragonBall()
            return { ...obs, active: false }
          }
          if (obs.type === 'NIMBUS') {
            setPowerUp('NIMBUS')
            powerUpTimer.current = 0
            return { ...obs, active: false }
          }
          if (obs.type === 'SENZU') {
            setPowerUp('SENZU') // Or handle extra life logic
            return { ...obs, active: false }
          }

          // Obstacles
          const isInvincible = activePowerUp === 'NIMBUS' || activePowerUp === 'SUPER_SAIYAN'
          if (!isInvincible) {
             if (obs.type === 'ROCK' && !isJumping) {
               hit = true
             }
             if (obs.type === 'BARRIER' && !isSliding) {
               hit = true
             }
          }
        }
        return obs
      })

      if (hit) {
        if (activePowerUp === 'SENZU') {
           // Consume Senzu to survive
           setPowerUp(null)
           // Make obstacles inactive to clear path
           return next.map(o => (Math.abs(o.z) < 5 ? { ...o, active: false } : o))
        } else {
           endGame()
        }
      }

      return hit ? prev : next
    })
  })

  return (
    <group>
      <World />
      <LevelManager obstacles={obstacles} setObstacles={setObstacles} />
      <Goku
        position={[lane * LANE_WIDTH, 0, 0]}
        isJumping={isJumping}
        isSliding={isSliding}
      />
    </group>
  )
}
