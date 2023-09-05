import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeeTable.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import Pagination from "../Pagination/Pagination";


const EmployeeTable = ({ employees, onDelete, onCheckboxChange }) => {

  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortDirection, setSortDirection] = useState(1); // 1 for ascending, -1 for descending
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCheckboxChange = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));

      onCheckboxChange(employeeId, selectedEmployees.includes(employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === sortedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(sortedEmployees.map((employee) => employee._id));
    }
  };
  

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
      (employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.middleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.level.toLowerCase().includes(searchQuery.toLowerCase());
    

    return matchesPosition && matchesLevel && matchesSearch;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortAttribute === "firstName" || sortAttribute === "middleName" || sortAttribute === "lastName") {
      const aNames = [a.firstName, a.middleName, a.lastName];
      const bNames = [b.firstName, b.middleName, b.lastName];
  
      let aValue, bValue;
  
      if (sortAttribute === "firstName") {
        aValue = aNames[0];
        bValue = bNames[0];
      } else if (sortAttribute === "middleName") {
        aValue = aNames[1];
        bValue = bNames[1];
      } else if (sortAttribute === "lastName") {
        aValue = aNames[2];
        bValue = bNames[2];
      }
  
      return sortDirection * aValue.localeCompare(bValue);
    }
  
    if (sortAttribute === "position" || sortAttribute === "level") {
      return sortDirection * a[sortAttribute].localeCompare(b[sortAttribute]);
    }
  
    return 0;
  });
  
  
  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowConfirmDialog(true);
  };

  const employeesPerPage = 10;
  const startIndex = (currentPage - 1) * employeesPerPage;
  const employeesToDisplay = sortedEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );
  const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="EmployeeTable">
      <div className="search-container">
        <div className="search-label">Find Employee:</div>
        <div className="search-input">
        <input
          type="text"
          placeholder="Enter employee name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput.trim() !== "" ? (
        <Link to={`/search/${searchInput}`}>
          <button type="button" className="search-button">
            <span className="search-icon">&#x1F50D;</span>
          </button>
        </Link>
        ) : (
          <button type="button" className="search-button" disabled>
            <span className="search-icon">&#x1F50D;</span>
          </button>
        )}
        <Link to="/top-paid">
          <button type="button">Top Paid Employees</button>
        </Link>
        <Link to="/missing">
          <button type="button">Missing Employees</button>
        </Link>
        </div>
      </div>

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

      <div className="sort-label">Sort Employees By:</div>
      <div className="sort-buttons">
        <button onClick={() => handleSort("firstName")}>
          First Name {sortAttribute === "firstName" && (sortDirection === 1 ? "🡹" : "🡻")}
          </button>
        <button onClick={() => handleSort("middleName")}>
          Middle Name {sortAttribute === "middleName" && (sortDirection === 1 ? "🡹" : "🡻")}
          </button>
        <button onClick={() => handleSort("lastName")}>
           Last Name {sortAttribute === "lastName" && (sortDirection === 1 ? "🡹" : "🡻")}
           </button>
        <button onClick={() => handleSort("position")}>
          Position {sortAttribute === "position" && (sortDirection === 1 ? "🡹" : "🡻")}
          </button>
        <button onClick={() => handleSort("level")}>
           Level {sortAttribute === "level" && (sortDirection === 1 ? "🡹" : "🡻")}
          </button>
      </div>
      <div>
        <input 
          type="checkbox"
          checked={selectedEmployees.length === sortedEmployees.length}
          onChange={handleSelectAll}
        /> Select All
      </div>
      <table>
        <thead>
          <tr>
            <th>Present</th>
            <th onClick={() => handleSort("firstName")}>
              Name{" "}
              {sortAttribute === "firstName" && (sortDirection === 1 ? "🡹" : "🡻")}
            </th>
            <th>Level</th>
            <th>Position</th>
            <th>Starting Date</th>
            <th>Current Salary (EUR)</th>
            <th>Desired Salary (EUR)</th>
            <th>Difference (EUR)</th>
            <th>Favourite Colour</th>
            <th>Favourite Brand</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {employeesToDisplay.map((employee) => (
            <tr key={employee._id}>
              <td>
                <input
                type="checkbox"
                checked={selectedEmployees.includes(employee._id)}
                onChange={() => handleCheckboxChange(employee._id)}
                />
              </td>
              <td><strong>{employee.firstName} {employee.middleName} {employee.lastName}</strong></td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>{new Date(employee.startingDate).toLocaleDateString("en-GB")}</td>
              {console.log(employee.startingDate)}
              <td>{parseInt(employee.currentSalary).toLocaleString()}</td>
              <td>{parseInt(employee.desiredSalary).toLocaleString()}</td>
              <td>{parseInt(employee.desiredSalary - employee.currentSalary).toLocaleString()}</td>
              <td className={`color-${employee.favouriteColour}`}>{employee.favouriteColour}</td>
              <td>{employee.favoriteBrand.name}</td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">
                    Update
                  </button>
                </Link>
                <button type="button" className="delete-button" onClick={() => handleDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {showConfirmDialog && (
        <ConfirmationModal
          onCancel={() => {
            setEmployeeToDelete(null);
            setShowConfirmDialog(false);
          }}
          onConfirm={() => {
            onDelete(employeeToDelete);
            setEmployeeToDelete(null);
            setShowConfirmDialog(false);
          }}
          />
      )}
    </div>
  );
};

export default EmployeeTable;
