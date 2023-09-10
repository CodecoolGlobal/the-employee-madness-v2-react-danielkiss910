import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ToolsPage = () => {
    // State for the list of tools
    const [tools, setTools] = useState([]);
    // States for adding a new tool
    const [newToolName, setNewToolName] = useState("");
    const [newToolWeight, setNewToolWeight] = useState("");
    // useSearchParams hook is used to get and set the query parameters in the URL
    const [searchParams, setSearchParams] = useSearchParams();
    // Getting the 'name' query parameter for filtering tools by name
    const nameFilter = searchParams.get("name") || "";

    // useEffect hook to fetch tools list from the backend
    useEffect(() => {
        let apiUrl = "/api/tools";
        if (nameFilter) {
            apiUrl += `?name=${nameFilter}`; // If there's a name filter, append it to the API URL       
        }

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setTools(data); // Update the tools state with fetched data
            })
            .catch(err => {
                console.error("Error fetching tools", err);
            });
    }, [nameFilter]); // Dependency array with 'nameFilter' to refetch data if it changes

    // Function to handle the change of the filter input
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSearchParams({ name: value }); // Setting the 'name' query parameter in the URL
    };

    // Function to handle adding a new tool
    const handleAddTool = () => {
        if (newToolName && newToolWeight) {
            const newTool = {
                name: newToolName,
                weight: newToolWeight,
            };

            // Make an API request to add the new tool to the backend
            fetch("/api/tools", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTool),
            })
                .then(res => res.json())
                .then(data => {
                    // Add the new tool to the tools list in state
                    setTools([...tools, data]);
                    // Clear input fields
                    setNewToolName("");
                    setNewToolWeight("");
                })
                .catch(err => {
                    console.error("Error adding new tool", err);
                });
        }
    };


    // Rendering the list of tools, filter input, and add new tool form
    return (
        <div className="tools-page">
            <h2>Tools</h2>
            <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={handleFilterChange}
            />
            <ul>
                {tools.map(tool => (
                    <li key={tool._id}>
                        <Link to={`/tools/${tool._id}`}>{tool.name}</Link>: {tool.weight} kg
                    </li>
                ))}
            </ul>
            <h3>Add new tool:</h3>
            <input
                type="text"
                placeholder="Tool Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Tool Weight (kg)"
                value={newToolWeight}
                onChange={(e) => setNewToolWeight(e.target.value)}
            />
            <button
                type="button"
                onClick={handleAddTool}
            >
                Add
            </button>
            <div>
                <Link to="/">
                    <button>Back</button>
                </Link>
            </div>
        </div>
    );
};

export default ToolsPage;