import React, { useState } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import EmployeeDetailsModal from "../EmployeeDetailsModal/EmployeeDetailsModal";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees, onDelete }) => {
  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortDirection, setSortDirection] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSort = (attribute) => {
    if (attribute === sortAttribute) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortAttribute(attribute);
      setSortOrder("asc");
    }
    setSortDirection(sortOrder === "asc" ? 1 : -1);
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

  const handleExport = () => {
    const csvData = sortedEmployees.map((employee) => ({
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      level: employee.level,
      position: employee.position,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedEmployees.length / employeesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
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
      <div className="dashboard-link">
        <Link to="/dashboard" className="dashboard-link">Go to Dashboard</Link>
      </div>
      <div className="missing-employees-link">
        <Link to="/missing-employees" className="missing-link">View Missing Employees</Link>
      </div>
      <button onClick={handleExport} className="export-button">Export to CSV</button>
      <EmployeeDetailsModal employee={selectedEmployee} onClose={closeModal} />
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
          {currentEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => { e.stopPropagation(); handleSelect(employee._id); }}
                  checked={selectedEmployees.includes(employee._id)}
                />
              </td>
              <td>
                <span onClick={(e) => { e.stopPropagation(); openModal(employee); }} className="clickable-name">
                  {`${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`}
                </span>
              </td>
              <td>
                <Link to={`/update/${employee._id}`} onClick={(e) => e.stopPropagation()}>
                  {employee.level}
                </Link>
              </td>
              <td>
                <Link to={`/update/${employee._id}`} onClick={(e) => e.stopPropagation()}>
                  {employee.position}
                </Link>
              </td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button" onClick={(e) => e.stopPropagation()}>
                    Update
                  </button>
                </Link>
                <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(employee._id); }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button key={number} id={number} onClick={handleClick} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTable;
