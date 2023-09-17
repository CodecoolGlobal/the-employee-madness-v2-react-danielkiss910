import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const DivisionTable = () => {
    const [divisions, setDivisions] = useState([]);
    const [deleteDivisionId, setDeleteDivisionId] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        fetch("/api/divisions")
            .then(res => res.json())
            .then(data => {
                setDivisions(data);
            })
            .catch(error => {
                console.error("Error fetching divisions", error);
            });
    }, []);

    const handleDelete = (id) => {
        handleOpenConfirmDialog(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteDivisionId) {
            try {
                const response = await fetch (`/api/divisions/${deleteDivisionId}`, {
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
                <Link to="/division-creator">
                    <button>Create Division</button>
                </Link>
            </div>
            <div>
                <h2>Division Table</h2>
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