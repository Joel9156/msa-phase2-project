import { create } from 'zustand'

const API_URL = 'http://localhost:5000/api'

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
    userName: string
    records: WalkingRecord[]
    progress: UserProgress | null
    fetchRecords: () => Promise<void>
    fetchProgress: () => Promise<void>
    addRecord: (steps: number) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
    userName: 'Joel',
    records: [],
    progress: null,

    fetchRecords: async () => {
        const { userName } = get()
        const res = await fetch(`${API_URL}/Walking?userName=${userName}`)
        const data = await res.json()
        set({ records: data })
    },


    fetchProgress: async () => {
        const { userName } = get()
        const res = await fetch(`${API_URL}/UserProgress/${userName}`)
        if (res.ok) {
            set({ progress: await res.json() })
        }
    },

    addRecord: async (steps: number) => {
        const { userName } = get()
        await fetch(`${API_URL}/Walking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName,
                steps,
                earnedPoints: 0,
                date: new Date().toISOString(),
            }),
        })
        await get().fetchRecords()
        await get().fetchProgress()
    },
}))
