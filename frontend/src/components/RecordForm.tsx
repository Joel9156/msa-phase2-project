import { useState } from 'react'
import { NumberInput, Button, Group } from '@mantine/core'
import { useAppStore } from '../store'

function RecordForm() {
    const [steps, setSteps] = useState<number | ''>('')
    const addRecord = useAppStore((state) => state.addRecord)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (steps === '') return
        await addRecord(steps)
        setSteps('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <Group align="flex-end">
                <NumberInput
                    label="Today's steps"
                    placeholder="e.g. 7000"
                    value={steps}
                    onChange={(value) => setSteps(value as number | '')}
                    min={0}
                    required
                />
                <Button type="submit" variant="gradient">Log Walk</Button>
            </Group>
        </form>
    )
}

export default RecordForm
