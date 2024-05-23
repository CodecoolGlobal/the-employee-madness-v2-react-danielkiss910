import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
import Loading from "../Components/Loading";
import "./ErrorMessage.css";

const fetchEquipmentById = async (id) => {
  const response = await fetch(`/api/equipment/${id}`);
  if (!response.ok) {
    throw new Error("Error fetching equipment");
  }
  return response.json();
};

const updateEquipment = async (id, updatedEquipment) => {
  const response = await fetch(`/api/equipment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEquipment),
  });
  if (!response.ok) {
    throw new Error("Error updating equipment");
  }
  return response.json();
};

const EquipmentUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await fetchEquipmentById(id);
        setEquipment(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  const handleUpdateEquipment = async (updatedEquipment) => {
    setLoading(true);
    try {
      await updateEquipment(id, updatedEquipment);
      navigate("/equipment");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <EquipmentForm
      equipment={equipment}
      onSave={handleUpdateEquipment}
      onCancel={() => navigate("/equipment")}
      disabled={loading}
    />
  );
};

export default EquipmentUpdater;
