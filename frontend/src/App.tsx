import React, { lazy, Suspense } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Games from './pages/Games'
import { SoundProvider } from './context/SoundContext'
import SoundToggle from './components/SoundToggle'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Lazy load all game components to split bundles and improve initial load time
const MathSprint = lazy(() => import('./games/MathSprint'));
const AstroPath = lazy(() => import('./games/AstroPath/AstroPath'));
const InvisibleMaze = lazy(() => import('./games/InvisibleMaze/InvisibleMaze'));
const DualNBack = lazy(() => import('./games/DualNBack/DualNBack'));
const SequenceMemory = lazy(() => import('./games/SequenceMemory/SequenceMemory'));
const Game2048 = lazy(() => import('./games/Game2048/Game2048'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin glow-cyan"></div>
    <p className="mt-4 text-cyan-400 font-medium tracking-widest uppercase text-sm animate-pulse">Loading System...</p>
  </div>
);

const App = () => {
  return (
    <SoundProvider>
      <SoundToggle />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Games />} />
          <Route path="/MathSprint" element={<MathSprint />} />
          <Route path="/astropath" element={<AstroPath />} />
          <Route path="/invisible-maze" element={<InvisibleMaze />} />
          <Route path="/dual-n-back" element={<DualNBack />} />
          <Route path="/sequence-memory" element={<SequenceMemory />} />
          <Route path="/2048" element={<Game2048 />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
      <Footer />
    </SoundProvider>
  )
}

export default App