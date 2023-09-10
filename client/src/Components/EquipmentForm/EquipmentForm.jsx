import { useState } from "react";

// A form for managing equipment details (create/update)
const EquipmentForm = ({ onSave, disabled, equipment, onCancel }) => {

  // Initial form field values
  const [name, setName] = useState(equipment?.name ?? "");
  const [type, setType] = useState(equipment?.type ?? "");
  const [amount, setAmount] = useState(equipment?.amount ?? "");

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    // Update or create new equipment based on provided data
    if (equipment) {
      return onSave({
        ...equipment,
        name,
        type,
        amount,
      });
    }

    return onSave({
      name,
      type,
      amount,
    });
  };

  
  return (
    <form className="EquipmentForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="type">Type:</label>
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          name="type"
          id="type"
        />
      </div>

      <div className="control">
        <label htmlFor="amount">Amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
          id="amount"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {equipment ? "Update Equipment" : "Create Equipment"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;
