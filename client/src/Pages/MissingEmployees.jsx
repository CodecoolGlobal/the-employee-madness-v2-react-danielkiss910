import React, { useEffect, useState } from "react";
import EmployeeTable from "../Components/EmployeeTable";
import Loading from "../Components/Loading";

const MissingEmployees = () => {
  const [missingEmployees, setMissingEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingEmployees();
  }, []);

  const fetchMissingEmployees = () => {
    fetch("/api/missing-employees")
      .then((res) => res.json())
      .then((data) => {
        // Set the missing employees data and update loading state
        setMissingEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching missing employees:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Missing Employees</h2>
      <EmployeeTable employees={missingEmployees} />
    </div>
  );
};

export default MissingEmployees;
