import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = async () => {
  const response = await fetch("/api/employees");
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};

const deleteEmployee = async (id) => {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
  return response.json();
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees((employees) => employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error(error);
      setError("Failed to delete employee");
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employees = await fetchEmployees();
        setEmployees(employees);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <EmployeeTable employees={employees} onDelete={handleDelete} />
    </div>
  );
};

export default EmployeeList;
