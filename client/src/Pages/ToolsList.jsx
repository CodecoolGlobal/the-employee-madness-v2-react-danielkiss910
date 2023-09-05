import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ToolsPage = () => {
    const [tools, setTools] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [newToolName, setNewToolName] = useState("");
    const [newToolWeight, setNewToolWeight] = useState("");

    useEffect(() => {
        fetch("/api/tools")
            .then(res => res.json())
            .then(data => {
                setTools(data);
            })
            .catch(err => {
                console.error("Error fetching tools", err);
            });
    }, []);

    const filteredTools = tools.filter((tool) =>
        tool.name.toLowerCase().includes(nameFilter.toLowerCase()));

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
    }


    return (
        <div className="tools-page">
            <h2>Tools</h2>
            <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
            />
            <ul>
                {filteredTools.map(tool => (
                    <li key={tool._id}>
                        {tool.name}: {tool.weight} kg
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