import React, { useState, useEffect } from "react";
import "./PetsPage.css";

const PetsPage = () => {
    const [pets, setPets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [petName, setPetName] = useState("");
    const [sortOfAnimal, setSortOfAnimal] = useState("");

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

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        setPets(employee.pets || []); // Initialize as empty array if employee has no pets
    };

    const handleAddPet = () => {
        if (petName && sortOfAnimal && selectedEmployee) {
            const newPet = {
                name: petName,
                sortOfAnimal: sortOfAnimal
            }
            fetch(`/api/pets/${selectedEmployee._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPet)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok")
                    }
                    return res.json();
                })
                .then(data => {
                    // Refetch all employees as shallow comparison will not detect a change
                    fetch("/api/employees")
                        .then(res => res.json())
                        .then(employeesData => {
                            setEmployees(employeesData);
                            const updatedEmployee = employeesData.find(emp => emp._id === selectedEmployee._id);
                            handleEmployeeSelect(updatedEmployee);
                        });
                    setPetName("");
                    setSortOfAnimal("");
                })                
                .catch(err => {
                    console.error("Error adding pet to employee", err);
                });
        }
    };

    return (
        <div className="pets-page">
            <h2>Pets Page</h2>
            <div className="container">
                <div className="employee-list">
                    <h3>Select an Employee:</h3>
                    <ul>
                        {employees.map(employee => (
                            <li key={employee._id} onClick={() => handleEmployeeSelect(employee)}>
                                {employee.firstName} {employee.middleName} {employee.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pet-section">
                    {selectedEmployee && (
                        <div>
                            <h3>Add a pet for {selectedEmployee.firstName}</h3>
                            <input
                                placeholder="Pet Name"
                                value={petName}
                                onChange={e => setPetName(e.target.value)}
                            />
                            <input
                                placeholder="Sort of Animal"
                                value={sortOfAnimal}
                                onChange={e => setSortOfAnimal(e.target.value)}
                            />
                            <button onClick={handleAddPet}>Add Pet</button>

                            <h3>Pets of {selectedEmployee.firstName}:</h3>
                            <ul>
                                {pets.map((pet, index) => (
                                    <li key={index}>
                                        {pet.name} - {pet.sortOfAnimal}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetsPage;