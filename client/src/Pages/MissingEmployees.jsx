import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MissingEmployees = () => {
    const [missingEmployees, setMissingEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    useEffect(() => {
        fetch("/api/missing")
        .then((res) => res.json())
        .then((data) => {
            setMissingEmployees(data);
        })
        .catch((error) => {
            console.error("Error fetching missing employees", error);
        });
    }, []);

    const handleCheckboxChange = (employeeId) => {
        if (selectedEmployees.includes(employeeId)) {
            setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
        } else {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        }
    };

    const handleSelectAll = () => {
        if (selectAllChecked) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(missingEmployees.map((employee) => employee._id));
        }
        setSelectAllChecked(!selectAllChecked);
    };

    const handleMarkPresent = async () => {
        try {
            const response = await fetch("/api/update-attendance", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ employeeIds: selectedEmployees }),
            });

            if (response.ok) {
                // Refresh the list of missing employees
                setMissingEmployees(missingEmployees.filter(emp => !selectedEmployees.includes(emp._id)));
                setSelectedEmployees([]);

                setSelectedEmployees([]); // Clear selected employees
            } else {
                console.error("Error updating attendance");
            }
        } catch (error) {
            console.error("Error updating attendance", error);
        }
    };

    return (
        <div>
            <h2>Missing Employees</h2>
            <label>
                <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAll}
                />{" "}
                Select All
            </label>
            <ul>
                {missingEmployees.map((employee) => (
                    <li key={employee._id}>
                        <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee._id)}
                            onChange={() => handleCheckboxChange(employee._id, !selectedEmployees.includes(employee._id))}
                        />
                        {employee.firstName} {employee.lastName}
                    </li>
                ))}
            </ul>
            <button onClick={handleMarkPresent}>Mark Present</button>
            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
    );
};

export default MissingEmployees;
