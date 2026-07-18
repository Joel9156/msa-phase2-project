import { Button, Container, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { HowItWorksSection, TierPreviewSection, ImpactExamplesSection } from './InfoSections'

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
                    c="teal.6"
                >
                    {'Green Footprint'.split('').map((char, i) => (
                        <span
                            key={i}
                            className="step-letter"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {char === ' ' ? ' ' : char}
                        </span>
                    ))}
                </Text>
                <Text size="lg" c="dimmed" ta="center" maw={720}>
                    Turn your daily steps into points, streaks, and real environmental impact.
                </Text>
                <Button component={Link} to="/login" size="md" variant="gradient" mt="md">
                    Get Started
                </Button>
            </Stack>

            <Stack gap={48}>
                <HowItWorksSection />
                <TierPreviewSection />
                <ImpactExamplesSection />
            </Stack>
        </Container>
    )
}

export default LandingPage
