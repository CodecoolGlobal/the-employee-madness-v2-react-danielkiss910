import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";

// Function to send POST request to create new equipment
const createEquipment = (equipment) => {
  return fetch("/api/equipment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  }).then((res) => res.json());
};

const EquipmentCreator = () => {
  // React Router Hook to Navigate Amongst Routes
  const navigate = useNavigate();

  // State Initialization for Loading Indication
  const [loading, setLoading] = useState(false);

  // Handler to Execute Create Equipment Action
  const handleCreateEquipment = (employee) => {
    setLoading(true); // Set Loading State as True During API Call

    createEquipment(employee)
      .then(() => {
        setLoading(false); // Set Loading State as False After API Call Completion
        navigate("/equipment"); // Redirect to Equipment Page After Creation
      })
  };


  // Component JSX
  return (
    // EquipmentForm Component to Collect Equipment Data and Handle Actions
    <EquipmentForm
      onCancel={() => navigate("/equipment")}
      disabled={loading}
      onSave={handleCreateEquipment}
    />
  );
};

export default EquipmentCreator;
