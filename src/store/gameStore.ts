import { create } from 'zustand'

export type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER'

interface GameStore {
  gameState: GameState
  score: number
  distance: number
  dragonBalls: number
  speed: number
  activePowerUp: string | null
  bestScore: number

  startGame: () => void
  endGame: () => void
  returnToMenu: () => void
  addScore: (points: number) => void
  addDistance: (dist: number) => void
  collectDragonBall: () => void
  increaseSpeed: (amount: number) => void
  setPowerUp: (powerUp: string | null) => void
  resetGame: () => void
}

const INITIAL_SPEED = 10
const MAX_SPEED = 30

export const useGameStore = create<GameStore>((set) => {
  const savedBestScore = parseInt(localStorage.getItem('bestScore') || '0', 10)
  const savedDragonBalls = parseInt(localStorage.getItem('dragonBalls') || '0', 10)

  return {
    gameState: 'MENU',
    score: 0,
    distance: 0,
    dragonBalls: savedDragonBalls,
    speed: INITIAL_SPEED,
    activePowerUp: null,
    bestScore: savedBestScore,

    startGame: () => set({
      gameState: 'PLAYING',
      score: 0,
      distance: 0,
      speed: INITIAL_SPEED,
      activePowerUp: null
    }),

    endGame: () => set((state) => {
      const newBestScore = Math.max(state.score, state.bestScore)
      localStorage.setItem('bestScore', newBestScore.toString())
      localStorage.setItem('dragonBalls', state.dragonBalls.toString())
      return {
        gameState: 'GAMEOVER',
        bestScore: newBestScore
      }
    }),

    returnToMenu: () => set({ gameState: 'MENU' }),

    addScore: (points) => set((state) => ({ score: state.score + points })),

    addDistance: (dist) => set((state) => ({ distance: state.distance + dist })),

    collectDragonBall: () => set((state) => {
      const newTotal = state.dragonBalls + 1;
      localStorage.setItem('dragonBalls', newTotal.toString());
      return {
        dragonBalls: newTotal,
        score: state.score + 50 // Bonus score for collecting
      };
    }),

    increaseSpeed: (amount) => set((state) => ({
      speed: Math.min(state.speed + amount, MAX_SPEED)
    })),

    setPowerUp: (powerUp) => set({ activePowerUp: powerUp }),

    resetGame: () => set(() => ({
      score: 0,
      distance: 0,
      speed: INITIAL_SPEED,
      activePowerUp: null
    }))
  }
})
