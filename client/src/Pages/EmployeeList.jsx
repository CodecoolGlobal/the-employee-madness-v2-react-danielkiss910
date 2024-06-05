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

const fetchEquipment = async () => {
  const response = await fetch("/api/equipment");
  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
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
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!isConfirmed) {
      return;
    }
  
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
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch employees");
      }
    };

    const loadEquipment = async () => {
      try {
        const equipmentData = await fetchEquipment();
        setEquipmentList(equipmentData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch equipment");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
    loadEquipment();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <EmployeeTable employees={employees} onDelete={handleDelete} equipmentList={equipmentList} />
    </div>
  );
};

export default EmployeeList;
