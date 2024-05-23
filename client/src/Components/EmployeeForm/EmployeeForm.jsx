import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [level, setLevel] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || "");
      setMiddleName(employee.middleName || "");
      setLastName(employee.lastName || "");
      setLevel(employee.level || "");
      setPosition(employee.position || "");
    }
  }, [employee]);

  const onSubmit = (e) => {
    e.preventDefault();

    const employeeData = {
      firstName,
      middleName,
      lastName,
      level,
      position,
    };

    if (employee) {
      employeeData._id = employee._id;
    }

    onSave(employeeData);
  };

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="firstName">First Name:</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          name="firstName"
          id="firstName"
        />
      </div>

      <div className="control">
        <label htmlFor="middleName">Middle Name:</label>
        <input
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          name="middleName"
          id="middleName"
        />
      </div>

      <div className="control">
        <label htmlFor="lastName">Last Name:</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          name="lastName"
          id="lastName"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name="position"
          id="position"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

EmployeeForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  employee: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    level: PropTypes.string,
    position: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
};

EmployeeForm.defaultProps = {
  disabled: false,
  employee: null,
};

export default EmployeeForm;
