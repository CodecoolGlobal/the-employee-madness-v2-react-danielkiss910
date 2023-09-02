import React from 'react';
import "./ConfirmationModal.css";

function ConfirmationModal({ onCancel, onConfirm }) {
  return (
    <div className="confirmation-modal">
      <div className='modal-content'>
        <p>Are you sure you want to delete this?</p>
        <button type='button' onClick={onConfirm}>
          Confirm
        </button>
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ConfirmationModal;