import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const EmployeeAddressPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [address, setAddress] = useState({
        country: "",
        city: "",
        street: "",
        zipCode: "",
    });

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prevAddress => ({ ...prevAddress, [name]: value }));
    };

    const handleAddressUpdate = () => {
        // API call to update employee address
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

    if (!employee) return <p>Employee not found.</p>;

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


    return (
        <div>
            <h2>{employee.firstName} {employee.middleName} {employee.lastName}</h2>
            <h3>Address</h3>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                    />
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        placeholder="City"
                    />
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleInputChange}
                        placeholder="Street"
                    />
                    <input
                        type="number"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip Code"
                    />
                    <Link to="/">
                        <button onClick={handleAddressUpdate}>Save</button>
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