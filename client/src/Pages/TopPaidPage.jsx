import React, { useEffect, useState } from "react";

const TopPaidPage = () => {
    const [topPaidEmployees, setTopPaidEmployees] = useState([]);

    useEffect(() => {
        fetch("/api/top-paid")
        .then(res => res.json())
        .then(data => {
            setTopPaidEmployees(data);
        })
        .catch(err => {
            console.error("Error fetching top paid employees", err);
        });
    }, []);

    return (
        <div className="top-paid-page">
            <h2>Top Paid Employees</h2>
            <ul>
                {topPaidEmployees.map(employee => (
                    <li key={employee._id}>
                        {employee.firstName} {employee.lastName}: € {employee.currentSalary}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopPaidPage;