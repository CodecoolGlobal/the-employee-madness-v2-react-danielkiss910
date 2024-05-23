import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
import Loading from "../Components/Loading";

const createEquipment = async (equipment) => {
  const response = await fetch("/api/equipment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  });

  if (!response.ok) {
    throw new Error("Failed to create equipment");
  }

  return response.json();
};

const EquipmentCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateEquipment = async (equipment) => {
    setLoading(true);
    setError(null);

    try {
      await createEquipment(equipment);
      navigate("/equipment");
    } catch (error) {
      console.error(error);
      setError("Failed to create equipment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <EquipmentForm
        onCancel={() => navigate("/equipment")}
        disabled={loading}
        onSave={handleCreateEquipment}
      />
    </div>
  );
};

export default EquipmentCreator;
