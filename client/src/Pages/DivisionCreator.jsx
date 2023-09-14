import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DivisionCreator = () => {
    const [divisions, setDivisions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newDivisionName, setNewDivisionName] = useState("");
    const [newDivisionBoss, setNewDivisionBoss] = useState("");
    const [newDivisionBudget, setNewDivisionBudget] = useState("");
    const [newDivisionCountry, setNewDivisionCountry] = useState("");
    const [newDivisionCity, setNewDivisionCity] = useState("");

    useEffect(() => {
        fetch("/api/divisions")
            .then(res => res.json())
            .then(data => {
                setDivisions(data);
            })
            .catch(err => {
                console.error("Error fetching divisions", err);
            });
    }, []);

    useEffect(() => {
        fetch("/api/employees")
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            })
            .catch(err => {
                console.error("Error fetching employees", err);
            });
    }, []);

    const handleAddDivison = () => {
        if (newDivisionName &&
            newDivisionBoss &&
            newDivisionBudget &&
            newDivisionCountry &&
            newDivisionCity) {
            const newDivision = {
                name: newDivisionName,
                boss: newDivisionBoss._id,
                budget: parseInt(newDivisionBudget),
                location: {
                    country: newDivisionCountry,
                    city: newDivisionCity
                }
            };

            fetch("/api/divisions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newDivision),
            })
                .then(res => res.json())
                .then(data => {
                    setDivisions([...divisions, data]);
                    setNewDivisionName("");
                    setNewDivisionBoss("");
                    setNewDivisionBudget("");
                    setNewDivisionCountry("");
                    setNewDivisionCity("");
                })
                .catch(error => {
                    console.error("Error adding new division", error);
                });
        }
    }

    return (
        <div className="division-creator-page">
            <div>
                <h2>Current Divisions</h2>
                <ul>
                    {divisions.map(division => (
                        <li key={division._id}>
                            <p><strong>Name: {division.name}</strong></p>
                            <p>Boss: {division.boss.firstName} {division.boss.middleName} {division.boss.lastName}</p>
                            <p>Budget: {division.budget}</p>
                            <p>Location: {division.location.city}, {division.location.country}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Create New Division</h2>
                <div className="control">
                    <input
                        type="text"
                        placeholder="Division Name"
                        value={newDivisionName}
                        onChange={(e) => setNewDivisionName(e.target.value)}
                    />
                    <select
                        name="boss"
                        value={newDivisionBoss?._id || ""}
                        onChange={(e) => {
                            const selectedEmployee = employees.find(employee => employee._id === e.target.value);
                            setNewDivisionBoss(selectedEmployee);
                        }}
                    >
                        <option value="">Select Division Boss</option>
                        {employees.map(employee => (
                            <option key={employee._id} value={employee._id}>
                                {employee.firstName} {employee.middleName} {employee.lastName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Budget"
                        value={newDivisionBudget}
                        onChange={(e) => setNewDivisionBudget(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={newDivisionCity}
                        onChange={(e) => setNewDivisionCity(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={newDivisionCountry}
                        onChange={(e) => setNewDivisionCountry(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleAddDivison}
                    >
                        Add New Division
                    </button>
                </div>
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
    )
};

export default DivisionCreator;