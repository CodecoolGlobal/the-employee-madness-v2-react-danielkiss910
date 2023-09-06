import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const EmployeeKittens = () => {
    const { employeeId } = useParams();
    const [kittens, setKittens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch kittens for given employee
        const fetchKittens = async () => {
            try {
                const response = await fetch(`/api/kittens/${employeeId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch kittens");
                }
                const data = await response.json();
                setKittens(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchKittens();
    }, [employeeId]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!kittens.length) {
        return <div>No kittens associated with this employee.</div>
    }

    return (
        <div>
            <h2>Kittens associated with Employee ID: {employeeId}</h2>
            <ul>
                {kittens.map((kitten) => (
                    <li key={kitten.id}>{kitten.name} - {kitten.weight} kg.</li>
                ))}
            </ul>
            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
    );
};

export default EmployeeKittens;