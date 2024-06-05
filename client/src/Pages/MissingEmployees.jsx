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
    fetch("/api/missing")
      .then((res) => res.json())
      .then((data) => {
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
