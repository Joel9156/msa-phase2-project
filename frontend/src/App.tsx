import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { useMantineColorScheme, useComputedColorScheme, ActionIcon } from '@mantine/core'
import WalkingBoard from './WalkingBoard'
import './App.css'

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  return (
    <ActionIcon
      variant="default"
      size="lg"
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
    >
      {computedColorScheme === 'dark' ? '☀️' : '🌙'}
    </ActionIcon>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Walking Tracker</h1>
        <nav>
          <NavLink to="/" end>My Records</NavLink>
        </nav>
        <ThemeToggle />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<WalkingBoard />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
