import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EmployeeSearch () {
    const { employeeSearch } = useParams();
    // console.log("Received client side search query:", employeeSearch);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        async function fetchSearchResults() {
            try {
                const response = await fetch(`/api/search/${employeeSearch}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results", error);
            }
        }
        fetchSearchResults();
    }, [employeeSearch]);

    console.log("Search results:", searchResults);

    return (
        <div>
            <h2>Search results for "{employeeSearch}"</h2>
            <ul>
                {searchResults.map((employee) => (
                    <li key={employee._id}>
                        <p><strong>{`${employee.firstName} ${employee.middleName} ${employee.lastName}`}</strong></p>
                        <p>{`Level: ${employee.level}`}</p>
                        <p>{`Position: ${employee.position}`}</p>
                    </li>
                ))}
            </ul>
            <Link to="/">
                <button type="button">Back</button>
            </Link>
        </div>
    )
}

export default EmployeeSearch;