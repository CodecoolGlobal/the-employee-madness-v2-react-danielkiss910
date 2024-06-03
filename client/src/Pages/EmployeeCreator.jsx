import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

const createEmployee = async (employee) => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error('Failed to create employee');
  }

  return response.json();
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateEmployee = async (employee) => {
    setLoading(true);
    try {
      await createEmployee(employee);
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      {error && <div>Error: {error}</div>}
      <EmployeeForm
        onSave={handleCreateEmployee}
        disabled={loading}
        onCancel={() => navigate('/')}
      />
    </div>
  );
};

export default EmployeeCreator;
