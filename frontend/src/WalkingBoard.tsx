import { Container, Stack, Title } from '@mantine/core'
import { useAppStore } from './store'
import ProgressCard from './components/ProgressCard'
import ImpactCard from './components/ImpactCard'
import QuizCard from './components/QuizCard'
import RecordForm from './components/RecordForm'
import RecordList from './components/RecordList'

function WalkingBoard() {
    const displayName = useAppStore((state) => state.displayName)

    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Title order={2} c="var(--mantine-color-text)">🏃 {displayName}'s Walking Records</Title>
                <ProgressCard />
                <ImpactCard />
                <QuizCard />
                <RecordForm />
                <RecordList />
            </Stack>
        </Container>
    )
}

export default WalkingBoard
