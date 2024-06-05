import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EquipmentTable.css";

const EquipmentTable = () => {
  const [equipment, setEquipment] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch equipment data on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Fetch equipment from the server
  const fetchEquipment = async () => {
    try {
      const response = await axios.get("/api/equipment");
      setEquipment(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  // Handle adding new equipment
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    const newEquipment = { name, type, amount };

    try {
      const response = await axios.post("/api/equipment", newEquipment);
      setEquipment([...equipment, response.data]);
      setName("");
      setType("");
      setAmount("");
    } catch (error) {
      console.error("Error adding equipment", error);
    }
  };

  // Handle deleting equipment
  const handleDeleteEquipment = async (id) => {
    try {
      await axios.delete(`/api/equipment/${id}`);
      const updatedEquipment = equipment.filter(item => item._id !== id);
      setEquipment(updatedEquipment);
    } catch (error) {
      console.error("Error deleting equipment", error);
    }
  };

  return (
    <div className="EquipmentTable">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.amount}</td>
              <td>
                <Link to={`/update-equipment/${item._id}`}>
                  <button type="button" className="update-button">Update</button>
                </Link>
                <button type="button" className="delete-button" onClick={() => handleDeleteEquipment(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-equipment-form">
        <h3>Add New Equipment</h3>
        <form onSubmit={handleAddEquipment}>
          <div className="form-control">
            <label htmlFor="name">Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              id="name"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="type">Type:</label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              name="type"
              id="type"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount:</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
              id="amount"
              required
            />
          </div>
          <button type="submit">Add Equipment</button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentTable;
