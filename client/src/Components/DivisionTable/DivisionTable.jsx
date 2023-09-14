import React from "react";
import { Link } from "react-router-dom";

const DivisionTable = () => {
    return (
        <div>
            <Link to="/division-creator">
                <button>Create Division</button>
            </Link>
            <h2>Division Table</h2>
            <Link to="/">
                <button>Back to Employees</button>
            </Link>
        </div>
    )
};

export default DivisionTable;