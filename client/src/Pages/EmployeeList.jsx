import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

// Fetch all employees from the API
const fetchEmployees = async () => {
  const res = await fetch("/api/employees");
  return await res.json();
};

// Delete a specific employee by ID from the API
const deleteEmployee = async (id) => {
  console.log("Attempting to delete employee with ID:", id);
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  return await res.json();
};

const EmployeeList = () => {
  // Initialize states for loading, employee data, error handling, and error messages
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Handler for the delete action
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const result = await deleteEmployee(id);
      console.log(result);
      if (result.success) {
        setEmployees((employees) => {
          // Remove the deleted employee from the list without refetching the whole list
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

  // Fetch all employees once the component mounts
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

  // Render the loading component while fetching data
  if (loading) {
    return <Loading />;
  }

  // Render error message if there's any error
  if (error) {
    return <p>{error}</p>
  }

  // Main component JSX
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
