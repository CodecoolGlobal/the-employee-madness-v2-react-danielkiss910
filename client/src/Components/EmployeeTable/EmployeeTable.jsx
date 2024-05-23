import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees, onDelete }) => {
  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortDirection, setSortDirection] = useState(1); // 1 for ascending, -1 for descending
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSort = (attribute) => {
    if (attribute === sortAttribute) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortAttribute(attribute);
      setSortOrder("asc");
    }
    setSortDirection(sortOrder === "asc" ? 1 : -1); // For lists to work in both ascending and descending order
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesPosition =
      !positionFilter || employee.position.toLowerCase().includes(positionFilter.toLowerCase());
    const matchesLevel =
      !levelFilter || employee.level.toLowerCase().includes(levelFilter.toLowerCase());
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.middleName && employee.middleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.level.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPosition && matchesLevel && matchesSearch;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue, bValue;

    if (sortAttribute === "firstName" || sortAttribute === "middleName" || sortAttribute === "lastName") {
      if (sortAttribute === "firstName") {
        aValue = a.firstName;
        bValue = b.firstName;
      } else if (sortAttribute === "middleName") {
        aValue = a.middleName || "";
        bValue = b.middleName || "";
      } else if (sortAttribute === "lastName") {
        aValue = a.lastName;
        bValue = b.lastName;
      }
      return sortDirection * aValue.localeCompare(bValue);
    }

    if (sortAttribute === "position" || sortAttribute === "level") {
      return sortDirection * a[sortAttribute].localeCompare(b[sortAttribute]);
    }

    return 0;
  });

  const handleSelect = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((employeeId) => employeeId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  return (
    <div className="EmployeeTable">
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Position"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Level"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="sort-buttons">
        <button onClick={() => handleSort("firstName")}>First Name</button>
        <button onClick={() => handleSort("lastName")}>Last Name</button>
        <button onClick={() => handleSort("middleName")}>Middle Name</button>
        <button onClick={() => handleSort("position")}>Position</button>
        <button onClick={() => handleSort("level")}>Level</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Level</th>
            <th>Position</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleSelect(employee._id)}
                  checked={selectedEmployees.includes(employee._id)}
                />
              </td>
              <td>{`${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">
                    Update
                  </button>
                </Link>
                <button type="button" onClick={() => onDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
