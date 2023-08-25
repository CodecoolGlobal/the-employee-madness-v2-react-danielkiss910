import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  // const handleSearch = () => {
  //   setLoading(true);
  //   fetch(`/api/employees/${searchQuery}`)
  //   .then((res) => res.json())
  //   .then((matchingEmployees) => {
  //     setLoading(false);
  //     setEmployees(matchingEmployees);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button> */}
      <EmployeeTable employees={employees} onDelete={handleDelete} />;
    </div>
  );
};

export default EmployeeList;
