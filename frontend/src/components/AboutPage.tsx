import { Container, Stack } from '@mantine/core'
import { HowItWorksSection, TierPreviewSection, ImpactExamplesSection } from './InfoSections'

function AboutPage() {
    return (
        <Container size="md" py="xl">
            <Stack gap={48}>
                <HowItWorksSection />
                <TierPreviewSection />
                <ImpactExamplesSection />
            </Stack>
        </Container>
    )
}

export default AboutPage
