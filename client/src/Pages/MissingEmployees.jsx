import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import MissingEmployeesList from "./MissingEmployeesList";

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
        setMissingEmployees(data.missingEmployees);
        setTotalEmployees(data.totalEmployees);
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
      <MissingEmployeesList missingEmployees={missingEmployees} totalEmployees={totalEmployees} />
    </div>
  );
};

export default MissingEmployees;
