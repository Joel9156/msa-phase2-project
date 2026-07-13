import { useState, useEffect } from 'react';

//  Core of TypeScript: Define the structure (type) of the data in advance.
interface WalkingRecord {
    id: number;
    userName: string;
    distanceKm: number;
    steps: number;
    earnedPoints: number;
    carbonSavedKg: number;
    date: string;
}

const API_URL = 'http://localhost:5000/api/Walking';

function WalkingBoard() {
    // Apply the WalkingRecord type to useState.
    const [records, setRecords] = useState<WalkingRecord[]>([]);

    // Controlled-input state for the "add record" form.
    const [userName, setUserName] = useState('');
    const [distanceKm, setDistanceKm] = useState('');
    const [steps, setSteps] = useState('');

    // Pulled out of useEffect so handleSubmit can call it again after a POST.
    function fetchRecords() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setRecords(data))
            .catch(err => console.error("Error fetching data:", err));
    }

    useEffect(() => {
        fetchRecords();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // stop the browser's default full-page form submit

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // tells ASP.NET Core to deserialize the body as JSON
            },
            body: JSON.stringify({
                userName,
                distanceKm: Number(distanceKm), // <input> values are always strings — the backend expects a double
                steps: Number(steps),
                earnedPoints: Math.round(Number(steps) / 100), // placeholder points formula
                carbonSavedKg: 0,
                date: new Date().toISOString(),
            }),
        });

        if (response.ok) {
            setUserName('');
            setDistanceKm('');
            setSteps('');
            fetchRecords(); // re-fetch so the new record shows up in the list
        } else {
            console.error('Failed to add record:', response.status);
        }
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>🏃 My Walking Records</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    step="0.1"
                    placeholder="Distance (km)"
                    value={distanceKm}
                    onChange={e => setDistanceKm(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Steps"
                    value={steps}
                    onChange={e => setSteps(e.target.value)}
                    required
                />
                <button type="submit">Add Record</button>
            </form>

            {records.length === 0 ? (
                <p>No records found. Time to go for a walk!</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {records.map(record => (
                        <li
                            key={record.id}
                            style={{
                                background: '#f4f4f4',
                                margin: '10px 0',
                                padding: '15px',
                                borderRadius: '8px'
                            }}
                        >
                            <strong>{record.userName}</strong> walked {record.distanceKm}km ({record.steps} steps)
                            <br />
                            <small style={{ color: 'gray' }}>
                                Date: {record.date.split('T')[0]}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default WalkingBoard;