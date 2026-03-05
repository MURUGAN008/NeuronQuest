import './App.css'
import { Routes, Route } from 'react-router-dom'
import MathSprint from './games/MathSprint'
import AstroPath from './games/AstroPath/AstroPath'
import InvisibleMaze from './games/InvisibleMaze/InvisibleMaze'
import DualNBack from './games/DualNBack/DualNBack';
import SequenceMemory from './games/SequenceMemory/SequenceMemory';
import Games from './pages/Games'
import { SoundProvider } from './context/SoundContext'
import SoundToggle from './components/SoundToggle'

const App = () => {
  return (
    <SoundProvider>
      <SoundToggle />
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="/MathSprint" element={<MathSprint />} />
        <Route path="/astropath" element={<AstroPath />} />
        <Route path="/invisible-maze" element={<InvisibleMaze />} />
        <Route path="/dual-n-back" element={<DualNBack />} />
        <Route path="/sequence-memory" element={<SequenceMemory />} />
      </Routes>
    </SoundProvider>
  )
}

export default App