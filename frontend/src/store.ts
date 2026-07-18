import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL

// JWTs are base64url-encoded, not plain base64 — swap the URL-safe characters
// back before decoding, since the token isn't secret and we'd rather read the
// display name from it than make an extra request.
function decodeDisplayName(token: string): string | null {
    try {
        const payload = token.split('.')[1]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const json = JSON.parse(atob(base64))
        return json.DisplayName ?? null
    } catch {
        return null
    }
}

const initialToken = localStorage.getItem('token')

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
    displayName: string | null
    records: WalkingRecord[]
    progress: UserProgress | null
    login: (userName: string, password: string) => Promise<string | null>
    register: (userName: string, password: string, displayName: string) => Promise<string | null>
    logout: () => void
    fetchRecords: () => Promise<void>
    fetchProgress: () => Promise<void>
    addRecord: (steps: number) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
    token: initialToken,
    displayName: initialToken ? decodeDisplayName(initialToken) : null,
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
        set({ token: data.token, displayName: decodeDisplayName(data.token) })
        return null
    },

    register: async (userName, password, displayName) => {
        const res = await fetch(`${API_URL}/Auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password, displayName }),
        })
        const data = await res.json()
        if (!res.ok) {
            return data.message ?? 'Registration failed'
        }
        localStorage.setItem('token', data.token)
        set({ token: data.token, displayName: decodeDisplayName(data.token) })
        return null
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ token: null, displayName: null, records: [], progress: null })
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
