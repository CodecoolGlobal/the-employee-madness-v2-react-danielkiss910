import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = async () => {
  const res = await fetch("/api/employees");
  return await res.json();
};

const deleteEmployee = async (id) => {
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  return await res.json();
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const result = await deleteEmployee(id);
      if (result.success) {
        setEmployees((employees) => {
          return employees.filter((employee) => employee._id !== id);
        });
      } else {
        setErrorMessage("Failed to delete employee. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to delete employee due to a network error. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
      })
      .catch((err) => {
        setLoading(false);
        setError("Failed to delete employee. Please try again.");
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <EmployeeTable 
        employees={employees} 
        setEmployees={setEmployees}
        onDelete={handleDelete} 
        />
    </div>
  );
};

export default EmployeeList;
