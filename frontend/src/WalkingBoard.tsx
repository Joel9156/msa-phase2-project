import { Container, Stack, Title } from '@mantine/core'
import ProgressCard from './components/ProgressCard'
import QuizCard from './components/QuizCard'
import RecordForm from './components/RecordForm'
import RecordList from './components/RecordList'

function WalkingBoard() {
    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Title order={2}>🏃 My Walking Records</Title>
                <ProgressCard />
                <QuizCard />
                <RecordForm />
                <RecordList />
            </Stack>
        </Container>
    )
}

export default WalkingBoard
