import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const updateEmployee = async (employee) => {
  const response = await fetch(`/api/employees/${employee._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  return response.json();
};

const fetchEmployee = async (id) => {
  const response = await fetch(`/api/employees/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }
  return response.json();
};

const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employeeData = await fetchEmployee(id);
        setEmployee(employeeData);
      } catch (error) {
        console.error(error);
        setError("Failed to load employee");
      } finally {
        setEmployeeLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  const handleUpdateEmployee = async (employee) => {
    setUpdateLoading(true);
    try {
      await updateEmployee(employee);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to update employee");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (employeeLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Update Employee</h2>
      {error && <div>Error: {error}</div>}
      <EmployeeForm
        employee={employee}
        onSave={handleUpdateEmployee}
        disabled={updateLoading}
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default EmployeeUpdater;
