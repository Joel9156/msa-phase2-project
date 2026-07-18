import { useState } from 'react'
import { Button, Card, Center, PasswordInput, SegmentedControl, Stack, TextInput, Text, Title } from '@mantine/core'
import { useAppStore } from '../store'

function LoginForm() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const login = useAppStore((state) => state.login)
    const register = useAppStore((state) => state.register)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        const action = mode === 'login' ? login : register
        const errorMessage = await action(userName, password)
        if (errorMessage) {
            setError(errorMessage)
        }
    }

    return (
        <Center mih="calc(100vh - 65px)" p="md">
            <Card shadow="md" padding="xl" radius="md" withBorder maw={480} w="100%">
                <Stack gap="md">
                    <Title order={2} ta="center">Walking Tracker</Title>
                    <SegmentedControl
                        value={mode}
                        onChange={(value) => setMode(value as 'login' | 'register')}
                        data={[
                            { label: 'Log In', value: 'login' },
                            { label: 'Register', value: 'register' },
                        ]}
                    />
                    <form onSubmit={handleSubmit}>
                        <Stack gap="sm">
                            <TextInput
                                label="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                            <PasswordInput
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <Text c="red" size="sm">{error}</Text>}
                            <Button type="submit">{mode === 'login' ? 'Log In' : 'Register'}</Button>
                        </Stack>
                    </form>
                </Stack>
            </Card>
        </Center>
    )
}

export default LoginForm
