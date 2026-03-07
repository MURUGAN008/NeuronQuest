import './App.css'
import { Routes, Route } from 'react-router-dom'
import MathSprint from './games/MathSprint'
import AstroPath from './games/AstroPath/AstroPath'
import InvisibleMaze from './games/InvisibleMaze/InvisibleMaze'
import DualNBack from './games/DualNBack/DualNBack';
import SequenceMemory from './games/SequenceMemory/SequenceMemory';
import Game2048 from './games/Game2048/Game2048';
import Games from './pages/Games'
import { SoundProvider } from './context/SoundContext'
import SoundToggle from './components/SoundToggle'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

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
        <Route path="/2048" element={<Game2048 />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
      <Footer />
    </SoundProvider>
  )
}

export default App