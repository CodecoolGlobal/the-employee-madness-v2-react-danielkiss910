import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EquipmentTable.css";

const EquipmentTable = () => {
  const [equipment, setEquipment] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get("/api/equipment");
      setEquipment(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const handleAddEquipment = async () => {
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
      <div className="filters">
        {/* Add filter inputs */}
      </div>
      <div className="sort-buttons">
        {/* Add sorting buttons */}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
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
                  <button type="button">Update</button>
                </Link>
                <button type="button" onClick={() => handleDeleteEquipment(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;