import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import "./MissingEmployees.css";

const MissingEmployees = () => {
  const [missingEmployees, setMissingEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingEmployees();
  }, []);

  const fetchMissingEmployees = () => {
    fetch("/api/missing")
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched Missing Employees:', data);
        if (data.missingEmployees && Array.isArray(data.missingEmployees)) {
          setMissingEmployees(data.missingEmployees);
          setTotalEmployees(data.totalEmployees);
        } else {
          console.error("Fetched data is not in the expected format:", data);
          setMissingEmployees([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching missing employees:", error);
        setMissingEmployees([]);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  const totalMissingEmployees = missingEmployees.length;

  const missingEmployeeItems = missingEmployees.map((employee) => (
    <div key={employee._id} className="missing-employee-item">
      <div>{`${employee.firstName} ${employee.lastName}`}</div>
      <div>{`Phone: ${employee.phone}`}</div>
      <div>{`Email: ${employee.email}`}</div>
    </div>
  ));

  return (
    <div className="missing-employees-container">
      <h2>Missing Employees</h2>
      <div className="missing-stats">
        <p>{`${totalMissingEmployees} of ${totalEmployees} total employees missing`}</p>
        {/* Add your chart component here */}
      </div>
      <div className="missing-employees-list">
        {missingEmployeeItems}
      </div>
    </div>
  );
};

export default MissingEmployees;
