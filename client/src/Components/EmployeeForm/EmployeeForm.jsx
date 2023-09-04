import { useEffect, useState } from "react";

const EmployeeForm = ({ onSave, disabled, employee, onCancel, equipmentList }) => {
  const [firstName, setFirstName] = useState(employee?.firstName ?? "");
  const [middleName, setMiddleName] = useState(employee?.middleName ?? "");
  const [lastName, setLastName] = useState(employee?.lastName ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [startingDate, setStartingDate] = useState(employee?.startingDate ?? "");
  const [currentSalary, setCurrentSalary] = useState(employee?.currentSalary ?? "");
  const [desiredSalary, setDesiredSalary] = useState(employee?.desiredSalary ?? "");
  const [favouriteColour, setFavouriteColour] = useState(employee?.favouriteColour ?? "");
  const [colours, setColours] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");

  useEffect(() => {
    fetch("/api/colours")
    .then(res => res.json())
    .then(data => {setColours(data);
  })
    .catch(err => {
      console.error("Error fetching colours", err);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const updatedEmployee = {
      firstName,
      middleName,
      lastName,
      level,
      position,
      startingDate,
      currentSalary,
      desiredSalary,
      favouriteColour,
      equipment: selectedEquipmentId
    };

    if (employee) {
      onSave({
        ...employee,
        ...updatedEmployee,
      });
    } else {
      onSave(updatedEmployee);
    }
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
      
      <div className="control">
        <label htmlFor="startingDate">Starting Date:</label>
        <input
          type="date"
          id="startingDate"
          name="startingDate"
          value={startingDate}
          onChange={(e) => setStartingDate(e.target.value)}
        />
      </div>
      
      <div className="control">
        <label htmlFor="currentSalary">Current Salary:</label>
        <input
          type="number"
          id="currentSalary"
          name="currentSalary"
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
        />
      </div>
      
      <div className="control">
        <label htmlFor="desiredSalary">Desired Salary:</label>
        <input
          type="number"
          id="desiredSalary"
          name="desiredSalary"
          value={desiredSalary}
          onChange={(e) => setDesiredSalary(e.target.value)}
        />
      </div>
      
      <div className="control">
        <label htmlFor="favouriteColour">Favourite Colour:</label>
        <input
          type="color"
          id="favouriteColour"
          name="favouriteColour"
          value={favouriteColour}
          onChange={(e) => setFavouriteColour(e.target.value)}
          accept={colours.join("Black", "Grey", "Red", "Blue", "Orange", "White", "Brown", "Pink", "Yellow", "Green", "Purple", "Maroon", "Turquoise", "Cyan", "Gold", "Teal", "Lime", "Salmon", "Olive", "Aqua", "Violet")}
        />
      </div>
      
      <div className="control">
        <label htmlFor="equipment">Assign Equipment:</label>
        <select
          name="equipment"
          value={selectedEquipmentId}
          onChange={(e) => setSelectedEquipmentId(e.target.value)}
        >
          {equipmentList.map(equipment => (
            <option key={equipment._id} value={equipment._id}>
              {equipment.name}
            </option>
          ))}
        </select>
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

export default EmployeeForm;
