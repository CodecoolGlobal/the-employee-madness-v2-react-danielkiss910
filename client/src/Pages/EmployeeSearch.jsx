import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EmployeeSearch () {
    // Grab the employee search term from the URL parameters
    const { employeeSearch } = useParams();

    // State to hold the search results
    const [searchResults, setSearchResults] = useState([]);

    // UseEffect hook to fetch search results whenever the search term changes
    useEffect(() => {
        async function fetchSearchResults() {
            try {
                // Send a request to the server to get search results
                const response = await fetch(`/api/search/${employeeSearch}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data); // Set the fetched data to the state
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


    // Main render of the component
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