import { Canvas } from '@react-three/fiber'
import { UI } from './components/UI'
import { GameLoop } from './components/GameLoop'

function App() {
  return (
    <div className="w-full h-screen bg-sky-300 relative overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 60, rotation: [-0.2, 0, 0] }}
        shadows
      >
        <GameLoop />
      </Canvas>
      <UI />
    </div>
  )
}

export default App
