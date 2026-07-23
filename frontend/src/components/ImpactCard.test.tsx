import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import ImpactCard from './ImpactCard'
import { useAppStore } from '../store'

function renderWithProviders(ui: React.ReactElement) {
    return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('ImpactCard', () => {
    beforeEach(() => {
        useAppStore.setState({ records: [] })
    })

    it('renders nothing when there are no logged steps', () => {
        renderWithProviders(<ImpactCard />)
        expect(screen.queryByText(/Your Impact/i)).not.toBeInTheDocument()
    })

    it('shows converted km/CO2 numbers based on total steps', () => {
        useAppStore.setState({
            records: [
                { id: 1, userName: 'test', steps: 10000, earnedPoints: 10, date: '2026-01-01' },
            ],
        })

        renderWithProviders(<ImpactCard />)

        expect(screen.getByText('7.6 km')).toBeInTheDocument()
    })
})
