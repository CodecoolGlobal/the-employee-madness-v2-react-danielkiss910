import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const DivisionTable = () => {
    const [divisions, setDivisions] = useState([]);
    const [deleteDivisionId, setDeleteDivisionId] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    // To implement filtering by country
    const [filterCountry, setFilterCountry] = useState("");
    // To implement sorting by name, keep track of sort direction
    const [sortDirection, setSortDirection] = useState("ascending");
    // If new sorting criterion, add variable to track current sorting criterion
    const [sortCriterion, setSortCriterion] = useState("name"); // ("name" or "budget")
    // If multiple sorting options needed, best to use dropdown selectors and switch statement

    useEffect(() => {
        fetch("/api/divisions")
            .then(res => res.json())
            .then(data => {
                // Filter fetched data before sorting
                let filteredData = data.filter(division => division.location.country.toLowerCase().includes(filterCountry.toLowerCase()));
                // When divisions are fetched or sort direction changes, need to sort the divisions
                let sortedData = [...filteredData] // If no filtering: let sortedData;
                // 2nd if/else when 2 sorting options (name/budget)
                if (sortCriterion === "name") {
                    if (sortDirection === "ascending") {
                        sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
                    } else { // Use filteredData instead of data if filtering is implemented
                        sortedData = filteredData.sort((a, b) => b.name.localeCompare(a.name));
                    }
                } else if (sortCriterion === "budget") {
                    if (sortDirection === "ascending") {
                        sortedData = filteredData.sort((a, b) => a.budget - b.budget);
                    } else { // No need to localeCompare when only comparing numbers
                        sortedData = filteredData.sort((a, b) => b.budget - a.budget);
                    }
                }
                setDivisions(sortedData); // Change from `data` to `sortedData` if sorting option is implemented
            })
            .catch(error => {
                console.error("Error fetching divisions", error);
            });
    }, [sortDirection, sortCriterion, filterCountry]); // Add sortDirection as dependency
    // Add sortCriterion as dependency as well if 2nd sorting option
    // Add filterCountry if filtering option added

    // Function for sort button to use to toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(prevDirection => prevDirection === "ascending" ? "descending" : "ascending");
    };

    // Function to handle sorting option change
    const handleSortChange = (criterion) => {
        setSortCriterion(criterion);
    };


    const handleDelete = (id) => {
        handleOpenConfirmDialog(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteDivisionId) {
            try {
                const response = await fetch(`/api/divisions/${deleteDivisionId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const updatedDivisions = divisions.filter(division => division._id !== deleteDivisionId);
                setDivisions(updatedDivisions);
                handleCloseConfirmDialog();
            } catch (error) {
                console.error("Error deleting division", error);
            }
        }
    };

    const handleOpenConfirmDialog = (id) => {
        setDeleteDivisionId(id);
        setShowConfirmDialog(true);
    };
    const handleCloseConfirmDialog = (id) => {
        setDeleteDivisionId(null);
        setShowConfirmDialog(false);
    };


    return (
        <div className="division-table">
            <div>
                <h2>Division Table</h2>
                <Link to="/division-creator">
                    <button>Create New Division</button>
                </Link>
            </div>
            <div>
                <div>
                    {/* Button to toggle asc/desc sorting */}
                    {/* When only 1 sorting option: <button onClick={toggleSortDirection}> */}
                    <button onClick={() => toggleSortDirection()}>
                        Toggle Direction ({sortDirection})
                    </button>
                    {/* Buttons to toggle sorting by criterion */}
                    <button onClick={() => handleSortChange("name")}>
                        Sort by Name
                    </button>
                    <button onClick={() => handleSortChange("budget")}>
                        Sort by Budget
                    </button>
                </div>
                <br />
                <div>
                    {/* UI input field to filter by name */}
                    <label>Filter by Country: </label>
                    <input
                        type="text"
                        value={filterCountry}
                        onChange={e => setFilterCountry(e.target.value)}
                        placeholder="Enter country to filter"
                    />
                    <button onClick={() => setFilterCountry("")}>X</button>
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Division Name</th>
                            <th>Location</th>
                            <th>Boss</th>
                            <th>Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        {divisions.map(division => (
                            <tr key={division._id}>
                                <td>{division.name}</td>
                                <td>{division.location.city}, {division.location.country}</td>
                                <td>{division.boss.firstName} {division.boss.middleName} {division.boss.lastName}</td>
                                <td>{division.budget}</td>
                                <td>
                                    <Link to={`/division-updater/${division._id}`}>
                                        <button type="button">
                                            Update
                                        </button>
                                    </Link>
                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDelete(division._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {showConfirmDialog && (
                            <ConfirmationModal
                                onCancel={handleCloseConfirmDialog}
                                onConfirm={handleConfirmDelete}
                            />
                        )}
                    </tbody>
                </table>
            </div>
            <br />
            <div>
                <Link to="/">
                    <button>Back to Employees</button>
                </Link>
            </div>
        </div>
    )
};

export default DivisionTable;