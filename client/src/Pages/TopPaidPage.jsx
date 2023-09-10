import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopPaidPage = () => {
    // State to hold the list of top paid employees
    const [topPaidEmployees, setTopPaidEmployees] = useState([]);

    // useEffect hook to fetch the list of top paid employees from the backend
    useEffect(() => {
        fetch("/api/top-paid")
        .then(res => res.json())
        .then(data => {
            setTopPaidEmployees(data); // Set the data to our state
        })
        .catch(err => {
            console.error("Error fetching top paid employees", err);
        });
    }, []); // An empty dependency array means the fetch will be executed once when the component mounts


    // Rendering the list of top paid employees
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
            <Link to="/">
            <button type="button">Back</button>
            </Link>
        </div>
    );
};

export default TopPaidPage;