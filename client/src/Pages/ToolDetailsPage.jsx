import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ToolDetailsPage = () => {
    // State to hold the details of the specific tool
    const [tool, setTool] = useState(null);

    // Using useParams hook to get the 'id' parameter from the URL
    const { id } = useParams();

    // UseEffect hook to fetch the tool details once the component is mounted and whenever the 'id' changes
    useEffect(() => {
        fetch(`/api/tools/${id}`)
        .then(res => res.json())
        .then(data => {
            setTool(data); // Setting the fetched data to the tool state
        })
        .catch(err => {
            console.error("Error fetching tool details", err); // Logging any error encountered
        });
    }, [id]); // Dependency array containing 'id' to refetch data if 'id' changes

    // Loading indication if the tool data is not yet fetched
    if (!tool) {
        return <p>Loading...</p>
    }


    // Rendering the details of the tool once the data is fetched
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