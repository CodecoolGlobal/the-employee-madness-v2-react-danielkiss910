import React, { useState, useEffect } from "react";
import EquipmentTable from "../Components/EquipmentTable/EquipmentTable";
import Loading from "../Components/Loading";
import "./EquipmentList.css";

const fetchEquipment = async () => {
  const response = await fetch("/api/equipment");
  
  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return response.json();
};

const EquipmentList = () => {
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const equipmentData = await fetchEquipment();
        setEquipment(equipmentData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Equipment List</h2>
      <EquipmentTable equipment={equipment} />
    </div>
  );
};

export default EquipmentList;
