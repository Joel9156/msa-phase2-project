import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL

interface WalkingRecord {
    id: number
    userName: string
    steps: number
    earnedPoints: number
    date: string
}

interface UserProgress {
    id: number
    userName: string
    totalPoints: number
    currentStreak: number
    lastActiveDate: string
    lastQuizDate: string
    tier: string
}

interface AppState {
    token: string | null
    records: WalkingRecord[]
    progress: UserProgress | null
    login: (userName: string, password: string) => Promise<string | null>
    register: (userName: string, password: string) => Promise<string | null>
    logout: () => void
    fetchRecords: () => Promise<void>
    fetchProgress: () => Promise<void>
    addRecord: (steps: number) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
    token: localStorage.getItem('token'),
    records: [],
    progress: null,

    login: async (userName, password) => {
        const res = await fetch(`${API_URL}/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password }),
        })
        const data = await res.json()
        if (!res.ok) {
            return data.message ?? 'Login failed'
        }
        localStorage.setItem('token', data.token)
        set({ token: data.token })
        return null
    },

    register: async (userName, password) => {
        const res = await fetch(`${API_URL}/Auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password }),
        })
        const data = await res.json()
        if (!res.ok) {
            return data.message ?? 'Registration failed'
        }
        localStorage.setItem('token', data.token)
        set({ token: data.token })
        return null
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ token: null, records: [], progress: null })
    },

    fetchRecords: async () => {
        const { token } = get()
        const res = await fetch(`${API_URL}/Walking`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        set({ records: data })
    },

    fetchProgress: async () => {
        const { token } = get()
        const res = await fetch(`${API_URL}/UserProgress/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
            set({ progress: await res.json() })
        }
    },

    addRecord: async (steps: number) => {
        const { token } = get()
        await fetch(`${API_URL}/Walking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                steps,
                earnedPoints: 0,
                date: new Date().toISOString(),
            }),
        })
        await get().fetchRecords()
        await get().fetchProgress()
    },
}))
