import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import WalkingBoard from './WalkingBoard'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Walking Tracker</h1>
        <nav>
          <NavLink to="/" end>My Records</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<WalkingBoard />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
