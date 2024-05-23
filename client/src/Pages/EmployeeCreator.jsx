import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const createEmployee = async (employee) => {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  return response.json();
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateEmployee = async (employee) => {
    setLoading(true);
    setError(null);

    try {
      await createEmployee(employee);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <EmployeeForm
          onCancel={() => navigate("/")}
          disabled={loading}
          onSave={handleCreateEmployee}
        />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EmployeeCreator;
