import { Button, Container, Stack, Text, Title, Card, SimpleGrid, Image } from '@mantine/core'
import { Link } from 'react-router-dom'
import sproutImg from '../assets/tiers/sprout.png'
import greenImg from '../assets/tiers/green.png'
import earthImg from '../assets/tiers/earth.png'
import ecoImg from '../assets/tiers/eco.png'

const HOW_IT_WORKS = [
    { emoji: '🚶', title: 'Log Your Steps', body: "Enter how many steps you walked today." },
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

function LandingPage() {
    return (
        <Container size="md" py="xl">
            <Stack align="center" gap="xs" mb={48}>
                <Text
                    component="h1"
                    ta="center"
                    fw={800}
                    size="40px"
                    lh={1.4}
                    py={4}
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'lime', deg: 45 }}
                >
                    Green Footprint
                </Text>
                <Text size="lg" c="dimmed" ta="center" maw={720}>
                    Turn your daily steps into points, streaks, and real environmental impact.
                </Text>
                <Button component={Link} to="/login" size="md" variant="gradient" mt="md">
                    Get Started
                </Button>
            </Stack>

            <Title order={3} ta="center" mb="md">How It Works</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb={48}>
                {HOW_IT_WORKS.map((step) => (
                    <Card key={step.title} withBorder padding="lg" radius="md">
                        <Text fw={700} mb={4}>{step.emoji} {step.title}</Text>
                        <Text size="sm" c="dimmed">{step.body}</Text>
                    </Card>
                ))}
            </SimpleGrid>

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
        </Container>
    )
}

export default LandingPage
