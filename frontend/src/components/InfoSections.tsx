import { Card, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import sproutImg from '../assets/tiers/sprout.png'
import greenImg from '../assets/tiers/green.png'
import earthImg from '../assets/tiers/earth.png'
import ecoImg from '../assets/tiers/eco.png'

const HOW_IT_WORKS = [
    { emoji: '🚶', title: 'Log Your Steps', body: 'Enter how many steps you walked today.' },
    { emoji: '🎯', title: 'Hit 6,000+ Steps', body: 'Earn 10 points and keep your daily streak alive.' },
    { emoji: '🔥', title: 'Keep the Streak Going', body: 'Every 7-day streak earns a 30-point bonus.' },
    { emoji: '🧠', title: 'Answer the Daily Quiz', body: "Correct answers on today's eco quiz earn bonus points too." },
]

const TIERS = [
    { image: sproutImg, name: 'Sprout Walker', range: '0–99 pts' },
    { image: greenImg, name: 'Green Walker', range: '100–299 pts' },
    { image: earthImg, name: 'Earth Keeper', range: '300–699 pts' },
    { image: ecoImg, name: 'Eco Guardian', range: '700+ pts' },
]

// Same rough conversion factors as ImpactCard, kept in sync manually since
// this section shows illustrative fixed examples rather than a live total.
const STRIDE_METERS = 0.762
const CAR_CO2_KG_PER_KM = 0.12
const TREE_CO2_KG_PER_YEAR = 21

const IMPACT_EXAMPLES = [6000, 10000, 100000].map((steps) => {
    const km = (steps * STRIDE_METERS) / 1000
    const co2Kg = km * CAR_CO2_KG_PER_KM
    const treePercent = (co2Kg / TREE_CO2_KG_PER_YEAR) * 100
    return { steps, km, co2Kg, treePercent }
})

export function HowItWorksSection() {
    return (
        <>
            <Title order={3} ta="center" mb="md">How It Works</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {HOW_IT_WORKS.map((step) => (
                    <Card key={step.title} withBorder padding="lg" radius="md">
                        <Text fw={700} mb={4}>{step.emoji} {step.title}</Text>
                        <Text size="sm" c="dimmed">{step.body}</Text>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    )
}

export function TierPreviewSection() {
    return (
        <>
            <Title order={3} ta="center" mb={4}>Level Up Your Tier</Title>
            <Text ta="center" c="dimmed" mb="md">As your points grow, so does your title.</Text>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                {TIERS.map((tier) => (
                    <Card key={tier.name} withBorder padding="md" radius="md">
                        <Stack align="center" gap={4}>
                            <Image src={tier.image} alt={tier.name} w={90} h={90} fit="contain" />
                            <Text fw={700} size="sm" ta="center">{tier.name}</Text>
                            <Text size="xs" c="dimmed">{tier.range}</Text>
                        </Stack>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    )
}

export function ImpactExamplesSection() {
    return (
        <>
            <Title order={3} ta="center" mb={4}>What Your Steps Are Worth</Title>
            <Text ta="center" c="dimmed" mb="md">
                Rough, illustrative estimates — not a scientific calculator.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {IMPACT_EXAMPLES.map((example) => (
                    <Card key={example.steps} withBorder padding="lg" radius="md">
                        <Text fw={700} ta="center" mb="xs">{example.steps.toLocaleString()} steps</Text>
                        <Group justify="center" gap="lg">
                            <Stack gap={0} align="center">
                                <Text fw={800}>{example.km.toFixed(1)} km</Text>
                                <Text size="xs" c="dimmed">walked</Text>
                            </Stack>
                            <Stack gap={0} align="center">
                                <Text fw={800}>{example.co2Kg.toFixed(1)} kg</Text>
                                <Text size="xs" c="dimmed">CO₂ vs. driving</Text>
                            </Stack>
                            <Stack gap={0} align="center">
                                <Text fw={800}>{example.treePercent.toFixed(0)}%</Text>
                                <Text size="xs" c="dimmed">of a tree's year</Text>
                            </Stack>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    )
}
