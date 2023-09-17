import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const DivisionUpdater = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [division, setDivision] = useState({});
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/divisions/${id}`)
            .then(res => res.json())
            .then(data => {
                setDivision(data);
                return fetch("/api/employees");
            })
            .then(res => res.json())
            .then(data => { 
                setEmployees(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data", error);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/divisions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json",
                },
                body: JSON.stringify(division)
        });

        if (response.ok) {
            navigate("/divisions");
        } else {
            console.error("Error updating division", await response.text());
        }
        } catch (error) {
            console.error("Error updating division", error);
        }
    };

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="division-updater">
            <div className="control">
                <h3>Update {division.name}</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={division.name}
                            onChange={e => setDivision(prevState => ({ ...prevState, name: e.target.value }))}
                            />
                    </label>
                    <br />
                    <label>
                        Boss:
                        <select
                            value={division.boss? division.boss._id : ""}
                            onChange={e => setDivision(prevState => ({ ...prevState, boss: employees.find(emp => emp._id === e.target.value) }))}
                            >
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.firstName} {emp.middleName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                    </label>
                    <br />
                    <label>
                        Budget:
                        <input
                            type="number"
                            value={division.budget}
                            onChange={e => setDivision(prevState => ({ ...prevState, budget: e.target.value }))}
                            />
                    </label>
                    <br />
                    <label>
                        City:
                        <input
                            type="text"
                            value={division.location? division.location.city: ""}
                            onChange={e => setDivision(prevState => ({ ...prevState, location: { ...prevState.location, city: e.target.value } }))}
                            />
                    </label>
                    <br />
                    <label>
                        Country:
                        <input
                            type="text"
                            value={division.location? division.location.country: ""}
                            onChange={e => setDivision(prevState => ({ ...prevState, location: { ...prevState.location, country: e.target.value } }))}
                            />
                    </label>
                    <br />
                    <button type="submit">Update</button>
                </form>
            </div>
            <br />
            <div>
                <Link to="/divisions">
                    <button>Back to Divisions</button>
                </Link>
                <Link to="/">
                    <button>Back to Employees</button>
                </Link>
            </div>
        </div>
    );
};

export default DivisionUpdater;