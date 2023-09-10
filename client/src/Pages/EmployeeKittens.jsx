import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const EmployeeKittens = () => {
    const { employeeId } = useParams();

    const [kittens, setKittens] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
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
        
        // Fetch employee name
        const fetchEmployeeName = async () => {
            try {
                const response = await fetch(`/api/employees/${employeeId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch employee name");
                }
                const data = await response.json();
                const fullName = `${data.firstName} ${data.middleName} ${data.lastName}`;
                setEmployeeName(fullName);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchKittens();
        fetchEmployeeName();

    }, [employeeId]);
        

        if (loading) {
        return <div>Loading...<Link to="/"><button>Back</button></Link></div>
    }

    if (error) {
        return <div>Error: {error}<Link to="/"><button>Back</button></Link></div>
    }

    if (!kittens.length) {
        return (
        <div>
            <h3>No kittens associated with this employee.</h3>
            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
        )
    }

    return (
        <div>
            <h5>Employee ID number: {employeeId}</h5>
            <h2>{employeeName}</h2>
            <h3>Kittens associated with employee:</h3>
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