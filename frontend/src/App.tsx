import './App.css'
import { Routes, Route } from 'react-router-dom'
import MathSprint from './games/MathSprint'
import AstroPath from './games/AstroPath/AstroPath'
import Games from './pages/Games'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="/MathSprint" element={<MathSprint />} />
        <Route path="/astropath" element={<AstroPath />} />
      </Routes>
    </>
  )
}

export default App