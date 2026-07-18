import { useEffect, useState } from 'react'
import { Card, Text, Radio, Button, Alert, Stack } from '@mantine/core'
import { useAppStore } from '../store'

const API_URL = import.meta.env.VITE_API_URL

interface QuizQuestion {
    id: number
    questionText: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
}

interface AnswerResult {
    correct: boolean
    bonusPoints: number
    correctOption: string
}

function QuizCard() {
    const token = useAppStore((state) => state.token)
    const records = useAppStore((state) => state.records)


    const fetchProgress = useAppStore((state) => state.fetchProgress)

    const [status, setStatus] = useState('loading')
    const [question, setQuestion] = useState<QuizQuestion | null>(null)
    const [selected, setSelected] = useState('')
    const [result, setResult] = useState<AnswerResult | null>(null)

    useEffect(() => {
        fetch(`${API_URL}/Quiz/today`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status)
                if (data.status === 'ready') {
                    setQuestion(data.question)
                }
            })
    }, [token, records])


    async function handleSubmit() {
        const res = await fetch(`${API_URL}/Quiz/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ questionId: question!.id, selectedOption: selected }),
        })
        const data = await res.json()
        setResult(data)
        fetchProgress()
    }


    if (status === 'loading') {
        return null
    }

    if (status === 'no_walk_logged') {
        return (
            <Alert color="blue" title="Today's Quiz">
                Log today's walk first to unlock the quiz.
            </Alert>
        )
    }

    if (status === 'already_completed' || result) {
        return (
            <Alert color={result?.correct ? 'green' : 'gray'} title="Today's Quiz">
                {result
                    ? result.correct
                        ? `Correct! +${result.bonusPoints} bonus points.`
                        : `Not quite — the correct answer was ${result.correctOption}.`
                    : "You've already answered today's quiz. Come back tomorrow!"}
            </Alert>
        )
    }

    if (!question) {
        return null
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={700} mb="sm">{question.questionText}</Text>
            <Radio.Group value={selected} onChange={setSelected}>
                <Stack gap="xs">
                    <Radio value="A" label={question.optionA} />
                    <Radio value="B" label={question.optionB} />
                    <Radio value="C" label={question.optionC} />
                    <Radio value="D" label={question.optionD} />
                </Stack>
            </Radio.Group>
            <Button mt="md" variant="gradient" disabled={!selected} onClick={handleSubmit}>
                Submit Answer
            </Button>
        </Card>
    )
}

export default QuizCard
