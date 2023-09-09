import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ToolsPage = () => {
    const [tools, setTools] = useState([]);
    const [newToolName, setNewToolName] = useState("");
    const [newToolWeight, setNewToolWeight] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const nameFilter = searchParams.get("name") || "";

    useEffect(() => {
        let apiUrl = "/api/tools";
        if (nameFilter) {
            apiUrl += `?name=${nameFilter}`;            
        }

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setTools(data);
            })
            .catch(err => {
                console.error("Error fetching tools", err);
            });
    }, [nameFilter]);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSearchParams({ name: value });
    };

    const handleAddTool = () => {
        if (newToolName && newToolWeight) {
            const newTool = {
                name: newToolName,
                weight: newToolWeight,
            };

            // Call an API endpoint to add the new tool to the DB
            fetch("/api/tools", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTool),
            })
                .then(res => res.json())
                .then(data => {
                    // Update tools list with new tool
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