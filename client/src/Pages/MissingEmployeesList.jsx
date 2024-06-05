import React from "react";

const MissingEmployeesList = ({ missingEmployees, totalEmployees }) => {
  return (
    <div>
      <h2>Missing Employees</h2>
      <p>
        {missingEmployees.length} of {totalEmployees} total employees missing.
      </p>
      <ul>
        {missingEmployees.map((employee) => (
          <li key={employee._id}>
            {employee.firstName} {employee.middleName} {employee.lastName} - {employee.position}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissingEmployeesList;
