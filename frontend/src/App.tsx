import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useMantineColorScheme, useComputedColorScheme, ActionIcon, Button, Group } from '@mantine/core'
import { useAppStore } from './store'
import WalkingBoard from './WalkingBoard'
import LoginForm from './components/LoginForm'
import LandingPage from './components/LandingPage'
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
  const token = useAppStore((state) => state.token)
  const logout = useAppStore((state) => state.logout)

  return (
    <BrowserRouter>
      <header>
        <h1>Green Footprint</h1>
        <nav>
          {token && <NavLink to="/" end>My Records</NavLink>}
        </nav>
        <Group ml="auto">
          <ThemeToggle />
          {token ? (
            <Button variant="subtle" color="gray.3" style={{ color: 'white' }} onClick={logout}>
              Log Out
            </Button>
          ) : (
            <Button component={Link} to="/login" variant="gradient" size="sm">
              Login
            </Button>
          )}
        </Group>
      </header>

      <main>
        <Routes>
          <Route path="/" element={token ? <WalkingBoard /> : <LandingPage />} />
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
