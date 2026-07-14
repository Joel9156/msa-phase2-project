import { useEffect } from 'react'
import { Card, Group, Text, Badge } from '@mantine/core'
import { useAppStore } from '../store'

function ProgressCard() {
    const progress = useAppStore((state) => state.progress)
    const fetchProgress = useAppStore((state) => state.fetchProgress)

    useEffect(() => {
        fetchProgress()
    }, [fetchProgress])

    if (!progress) {
        return null
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
                <Text fw={700} size="lg">{progress.userName}</Text>
                <Badge color="green">{progress.tier}</Badge>
            </Group>
            <Text mt="sm">Total Points: {progress.totalPoints}</Text>
            <Text>Current Streak: {progress.currentStreak} day{progress.currentStreak === 1 ? '' : 's'}</Text>
        </Card>
    )
}

export default ProgressCard
