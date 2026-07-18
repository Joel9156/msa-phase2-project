import { Card, Text, Group, Stack } from '@mantine/core'
import { useAppStore } from '../store'

// Rough, illustrative conversions only (not scientifically precise) — meant to
// make the step count feel meaningful, not to be an exact carbon calculator.
const STRIDE_METERS = 0.762
const CAR_CO2_KG_PER_KM = 0.12
const TREE_CO2_KG_PER_YEAR = 21

function ImpactCard() {
    const records = useAppStore((state) => state.records)
    const totalSteps = records.reduce((sum, r) => sum + r.steps, 0)

    if (totalSteps === 0) {
        return null
    }

    const km = (totalSteps * STRIDE_METERS) / 1000
    const co2Kg = km * CAR_CO2_KG_PER_KM
    const treePercent = (co2Kg / TREE_CO2_KG_PER_YEAR) * 100

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={700} mb={2}>🌍 Your Impact</Text>
            <Text size="xs" c="dimmed" mb="sm">
                Rough estimate based on {totalSteps.toLocaleString()} total steps logged
            </Text>
            <Group grow>
                <Stack gap={0} align="center">
                    <Text fw={800} size="20px">{km.toFixed(1)} km</Text>
                    <Text size="xs" c="dimmed">walked</Text>
                </Stack>
                <Stack gap={0} align="center">
                    <Text fw={800} size="20px">{co2Kg.toFixed(1)} kg</Text>
                    <Text size="xs" c="dimmed">CO₂ vs. driving</Text>
                </Stack>
                <Stack gap={0} align="center">
                    <Text fw={800} size="20px">{treePercent.toFixed(0)}%</Text>
                    <Text size="xs" c="dimmed">of a tree's yearly CO₂</Text>
                </Stack>
            </Group>
        </Card>
    )
}

export default ImpactCard
