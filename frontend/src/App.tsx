import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { useMantineColorScheme, useComputedColorScheme, ActionIcon, Button, Group } from '@mantine/core'
import { useAppStore } from './store'
import WalkingBoard from './WalkingBoard'
import LoginForm from './components/LoginForm'
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
        <h1>Walking Tracker</h1>
        <nav>
          <NavLink to="/" end>My Records</NavLink>
        </nav>
        <Group ml="auto">
          <ThemeToggle />
          {token && (
            <Button variant="subtle" color="gray.3" style={{ color: 'white' }} onClick={logout}>
              Log Out
            </Button>
          )}
        </Group>
      </header>

      <main>
        <Routes>
          <Route path="/" element={token ? <WalkingBoard /> : <LoginForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
