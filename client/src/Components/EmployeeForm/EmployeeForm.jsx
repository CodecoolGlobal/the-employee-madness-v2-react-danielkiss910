import { useState } from "react";

const EmployeeForm = ({ onSave, disabled, employee, onCancel, favoriteBrands, favouriteColours, equipmentList }) => {
  const [firstName, setFirstName] = useState(employee?.firstName ?? "");
  const [middleName, setMiddleName] = useState(employee?.middleName ?? "");
  const [lastName, setLastName] = useState(employee?.lastName ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [startingDate, setStartingDate] = useState(employee?.startingDate ?? "");
  const [currentSalary, setCurrentSalary] = useState(employee?.currentSalary ?? "");
  const [desiredSalary, setDesiredSalary] = useState(employee?.desiredSalary ?? "");
  const [favouriteColour, setFavouriteColour] = useState(employee?.favouriteColour ?? "");
  const [favoriteBrand, setfavoriteBrand] = useState(employee?.favoriteBrand ?? "");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");


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
      favoriteBrand,
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
        <select
          name="favouriteColour"
          value={favouriteColour}
          onChange={(e) => setFavouriteColour(e.target.value)}
        >
          <option value="">Select Favourite Colour</option>
          {favouriteColours?.map(colour => (
            <option key={colour._id} value={colour._id}>
              {colour.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control">
        <label htmlFor="favoriteBrand">Favourite Brand:</label>
        <select
          name="favoriteBrand"
          value={favoriteBrand}
          onChange={(e) => setfavoriteBrand(e.target.value)}
        >
          <option value="">Select Favorite Brand</option>
          {favoriteBrands.map(brand => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* <div className="control">
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
      </div> */}

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
