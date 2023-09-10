import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

// Fetch functions for different resources
const fetchEquipment = () => {
  return fetch(`/api/equipment`)
  .then((res) => res.json());
};

const fetchEmployee = (id) => {
  return fetch(`/api/employees/${id}`).then((res) => res.json());
};

const fetchColours = () => {
  return fetch(`/api/colours`)
    .then((res) => res.json())
};

const fetchFavoriteBrands = () => {
  return fetch(`/api/favoritebrands`)
  .then((res) => res.json());
};

const fetchFavoriteBoardGames = () => {
  return fetch(`/api/games`)
  .then((res) => res.json());
};

const fetchDivisions = () => {
  return fetch(`/api/divisions`)
  .then((res) => res.json());
}

// Function to send a PATCH request to update an employee
const updateEmployee = (employee) => {
  return fetch(`/api/employees/${employee._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const EmployeeUpdater = () => {
  // React Router Hooks
  const { id } = useParams(); // Get Employee ID from URL parameters
  const navigate = useNavigate();

  // State Initialization for various components and data
  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [favouriteColours, setFavouriteColours] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [favoriteBrands, setfavoriteBrands] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Fetch all necessary data when the component mounts
  useEffect(() => {
    setEmployeeLoading(true);
    Promise.all([
      fetchEmployee(id), 
      fetchColours(), 
      fetchEquipment(),
      fetchFavoriteBrands(),
      fetchFavoriteBoardGames(),
      fetchDivisions(),
    ])
      .then(([employee, favouriteColours, equipment, favoriteBrands, boardGames]) => {
        setEmployee(employee);
        setFavouriteColours(favouriteColours);
        setfavoriteBrands(favoriteBrands);
        setEquipmentList(equipment);
        setBoardGames(boardGames);
        setDivisions(divisions);
        if (employee) {
          setSelectedEquipmentId(employee.equipment);
        }
        setEmployeeLoading(false);
      });
  }, [id, divisions]);

  // Handler for the update action
  const handleUpdateEmployee = (employee) => {
    setUpdateLoading(true);
    updateEmployee(employee)
      .then(() => {
        setUpdateLoading(false);
        navigate("/"); // Navigate to the root after update
      });
  };

  // Show loading screen if employee data is being fetched
  if (employeeLoading) {
    return <Loading />;
  }


  // Component JSX
  return (
    <EmployeeForm
      employee={employee}
      onSave={handleUpdateEmployee}
      disabled={updateLoading}
      onCancel={() => navigate("/")}
      favouriteColours={favouriteColours}
      assignedEquipment={equipmentList}
      favoriteBrands={favoriteBrands}
      selectedEquipmentId={selectedEquipmentId}
      boardGames={boardGames}
      allowAddKittens={true}
      divisions={divisions}
    />
  );
};

export default EmployeeUpdater;
