import { useEffect } from 'react'
import { Table } from '@mantine/core'
import { useAppStore } from '../store'

function RecordList() {
    const records = useAppStore((state) => state.records)
    const fetchRecords = useAppStore((state) => state.fetchRecords)

    useEffect(() => {
        fetchRecords()
    }, [fetchRecords])

    return (
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Steps</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {records.map((record) => (
                    <Table.Tr key={record.id}>
                        <Table.Td>{record.date.split('T')[0]}</Table.Td>
                        <Table.Td>{record.steps.toLocaleString()}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    )
}

export default RecordList
