import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ToolDetailsPage = () => {
    const [tool, setTool] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`/api/tools/${id}`)
        .then(res => res.json())
        .then(data => {
            setTool(data);
        })
        .catch(err => {
            console.error("Error fetching tool details", err);
        });
    }, [id]);

    if (!tool) {
        return <p>Loading...</p>
    }

    return (
        <div className="tool-details">
            <h2>{tool.name}</h2>
            <p>Weight: {tool.weight}</p>
            <Link to="/tools">
                <button>Back to tools</button>
                </Link>
        </div>
    );
};

export default ToolDetailsPage;