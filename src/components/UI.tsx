import { useGameStore } from '../store/gameStore'
import { Play, RotateCcw, Home, HelpCircle } from 'lucide-react'

export function UI() {
  const {
    gameState,
    score,
    distance,
    dragonBalls,
    bestScore,
    activePowerUp,
    startGame,
    returnToMenu,
    resetGame
  } = useGameStore()

  if (gameState === 'MENU') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-8 text-center" style={{ WebkitTextStroke: '2px #b91c1c' }}>
          GOKU'S<br/>ADVENTURE RUN
        </h1>

        <div className="bg-orange-900/80 p-8 rounded-2xl border-4 border-orange-500 flex flex-col gap-4 w-full max-w-md">
          <p className="text-center text-xl font-bold mb-4 text-orange-200">Best Score: {Math.floor(bestScore)}</p>
          <p className="text-center text-xl font-bold mb-4 text-orange-200">Total Dragon Balls: {dragonBalls}</p>

          <button
            onClick={startGame}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-black text-2xl py-4 px-8 rounded-xl transform transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
          >
            <Play fill="currentColor" /> PLAY NOW
          </button>

          <div className="mt-4 text-sm text-orange-200">
            <p className="font-bold mb-2 flex items-center gap-2"><HelpCircle size={16}/> How to Play:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Arrows / WASD / Swipe to Move</li>
              <li>Up / Space / Swipe Up to Jump (Rocks)</li>
              <li>Down / S / Swipe Down to Slide (Barriers)</li>
              <li>Collect Dragon Balls & Power-ups</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
        <h1 className="text-6xl font-black text-red-500 mb-8 tracking-wider" style={{ WebkitTextStroke: '1px #ffffff' }}>
          GAME OVER
        </h1>

        <div className="bg-slate-900/90 p-8 rounded-2xl border-4 border-slate-600 flex flex-col gap-6 w-full max-w-md items-center">
          <div className="text-center w-full">
            <p className="text-slate-400 text-lg">Score</p>
            <p className="text-4xl font-bold text-yellow-400">{Math.floor(score)}</p>
          </div>

          <div className="flex justify-between w-full border-t border-slate-700 pt-4">
            <div className="text-center">
              <p className="text-slate-400">Distance</p>
              <p className="text-xl font-bold">{Math.floor(distance)}m</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Best Score</p>
              <p className="text-xl font-bold">{Math.floor(bestScore)}</p>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <button
              onClick={() => { resetGame(); startGame(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-4 rounded-xl transition active:scale-95"
            >
              <RotateCcw size={20} /> RESTART
            </button>
            <button
              onClick={() => { resetGame(); returnToMenu(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition active:scale-95"
            >
              <Home size={20} /> MENU
            </button>
          </div>
        </div>
      </div>
    )
  }

  // PLAYING HUD
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="bg-black/50 backdrop-blur rounded-xl p-3 border-2 border-orange-500/50 flex flex-col gap-1">
          <div className="text-yellow-400 font-black text-2xl drop-shadow-md">
            {Math.floor(score)}
          </div>
          <div className="text-white font-bold text-sm">
            {Math.floor(distance)}m
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur rounded-xl p-3 border-2 border-orange-500/50 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 border border-orange-200 flex items-center justify-center text-xs font-black text-red-700 shadow-[0_0_10px_rgba(255,165,0,0.5)]">
            ★
          </div>
          <span className="text-white font-black text-xl">{dragonBalls}</span>
        </div>
      </div>

      {activePowerUp && (
        <div className="self-center mb-10 bg-yellow-400/90 text-black px-6 py-2 rounded-full font-black text-xl animate-pulse shadow-[0_0_20px_rgba(255,255,0,0.8)] border-2 border-white">
          {activePowerUp} ACTIVE!
        </div>
      )}
    </div>
  )
}
