import HorrorMovieTarot from './HorrorMovieTarot'
import Balatro from './Balatro'
import './index.css'

function App() {
  return (
    <div>
      {/* Background WebGL (Balatro swirl) */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Balatro isRotate={false} mouseInteraction={true} />
      </div>
      {/* Foreground UI */}
      <div className="app-container">
        <HorrorMovieTarot />
      </div>
    </div>
  )
}

export default App
