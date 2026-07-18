import { useEffect } from 'react'
import { Card, Group, Stack, Text, Image } from '@mantine/core'
import { useAppStore } from '../store'
import sproutImg from '../assets/tiers/sprout.png'
import greenImg from '../assets/tiers/green.png'
import earthImg from '../assets/tiers/earth.png'
import ecoImg from '../assets/tiers/eco.png'

const TIER_CHARACTERS: Record<string, string> = {
    'Sprout Walker': sproutImg,
    'Green Walker': greenImg,
    'Earth Keeper': earthImg,
    'Eco Guardian': ecoImg,
}

function ProgressCard() {
    const progress = useAppStore((state) => state.progress)
    const displayName = useAppStore((state) => state.displayName)
    const fetchProgress = useAppStore((state) => state.fetchProgress)

    useEffect(() => {
        fetchProgress()
    }, [fetchProgress])

    if (!progress) {
        return null
    }

    const characterImage = TIER_CHARACTERS[progress.tier]

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap={4}>
                {characterImage && (
                    <Image
                        src={characterImage}
                        alt={progress.tier}
                        w={220}
                        h={220}
                        fit="contain"
                    />
                )}
                <Text fw={700} size="xl">{progress.tier}</Text>
                <Text c="dimmed" size="sm">{displayName}</Text>
            </Stack>
            <Group justify="center" gap="xl" mt="md">
                <Stack gap={0} align="center">
                    <Text
                        size="28px"
                        fw={800}
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'lime', deg: 45 }}
                    >
                        {progress.totalPoints}
                    </Text>
                    <Text size="xs" c="dimmed">Total Points</Text>
                </Stack>
                <Stack gap={0} align="center">
                    <Text
                        size="28px"
                        fw={800}
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'lime', deg: 45 }}
                    >
                        {progress.currentStreak}
                    </Text>
                    <Text size="xs" c="dimmed">Day{progress.currentStreak === 1 ? '' : 's'} Streak</Text>
                </Stack>
            </Group>
        </Card>
    )
}

export default ProgressCard
