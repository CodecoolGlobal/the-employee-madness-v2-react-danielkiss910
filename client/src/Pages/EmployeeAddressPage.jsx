import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const EmployeeAddressPage = () => {
    // Get employee ID from the URL parameters
    const { id } = useParams();

    // States to manage employee data and address editing functionality
    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [address, setAddress] = useState({
        country: "",
        city: "",
        street: "",
        zipCode: "",
    });

    // Fetch the employee data when the component mounts or when the employee ID changes
    useEffect(() => {
        fetch(`/api/employees/${id}`)
            .then(res => res.json())
            .then(data => {
                setEmployee(data)
                setAddress(data.address || {
                    country: "",
                    city: "",
                    street: "",
                    zipCode: "",
                });
            })
            .catch(err => console.error("Error fetching employee", err));
    }, [id]);

    // Turn on the address editing mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle changes in the address input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prevAddress => ({ ...prevAddress, [name]: value }));
    };

    // Update the employee address in the backend
    const handleAddressUpdate = () => {
        fetch(`/api/employees/${id}/address`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(address)
        })
            .then(res => res.json())
            .then(updatedEmployee => {
                setEmployee(updatedEmployee);
                setIsEditing(false);
            })
            .catch(err => console.error("Error updating address", err));
    };

    // Render a message if the employee data is not yet fetched
    if (!employee) return <p>Employee not found.</p>;

    // Render a message if the employee doesn't have an address and is not in editing mode
    if (!employee.address && !isEditing) {
        return (
            <div>
                <h2>{employee.firstName} {employee.middleName} {employee.lastName}</h2>
                <p>This employee has no address registered.</p>
                <button onClick={handleEditClick}>Add Address</button>
                <Link to="/">
                    <button>Back</button>
                </Link>
            </div>
        )
    }


    // Render the employee address and editing functionality
    return (
        <div>
            <h2>{employee.firstName} {employee.middleName} {employee.lastName}</h2>
            <h3>Address:</h3>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                    />
                    <br />
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        placeholder="City"
                    />
                    <br />
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleInputChange}
                        placeholder="Street"
                    />
                    <br />
                    <input
                        type="number"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip Code"
                    />
                    <br />
                    <Link to="/">
                        <button onClick={handleAddressUpdate}>Save</button>
                    </Link>
                    <Link to="/">
                        <button >Cancel</button>
                    </Link>
                </div>
            ) : (
                <div>
                    <p>Country: {employee.address?.country || "N/A"}</p>
                    <p>City: {employee.address?.city || "N/A"}</p>
                    <p>Street: {employee.address?.street || "N/A"}</p>
                    <p>Zip Code: {employee.address?.zipCode || "N/A"}</p>
                    <button onClick={handleEditClick}>Edit</button>
                    <Link to="/">
                        <button>Back</button>
                    </Link>
                </div>
            )}
        </div>
    )
};

export default EmployeeAddressPage;