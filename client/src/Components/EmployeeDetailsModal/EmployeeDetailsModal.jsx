import React from "react";
import "./EmployeeDetailsModal.css";

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Employee Details</h2>
        <p><strong>Name:</strong> {`${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`}</p>
        <p><strong>Level:</strong> {employee.level}</p>
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
