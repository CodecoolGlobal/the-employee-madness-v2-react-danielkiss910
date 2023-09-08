import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [favouriteColours, setFavouriteColours] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [favoriteBrands, setfavoriteBrands] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState([]);
  const [boardGames, setBoardGames] = useState([]);

  useEffect(() => {
    setEmployeeLoading(true);
    Promise.all([
      fetchEmployee(id), 
      fetchColours(), 
      fetchEquipment(),
      fetchFavoriteBrands(),
      fetchFavoriteBoardGames(),
    ])
      .then(([employee, favouriteColours, equipment, favoriteBrands, boardGames]) => {
        setEmployee(employee);
        setFavouriteColours(favouriteColours);
        setfavoriteBrands(favoriteBrands);
        setEquipmentList(equipment);
        setBoardGames(boardGames);
        if (employee) {
          setSelectedEquipmentId(employee.equipment);
        }
        setEmployeeLoading(false);
      });
  }, [id]);

  const handleUpdateEmployee = (employee) => {
    setUpdateLoading(true);
    updateEmployee(employee)
      .then(() => {
        setUpdateLoading(false);
        navigate("/");
      });
  };

  if (employeeLoading) {
    return <Loading />;
  }

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
    />
  );
};

export default EmployeeUpdater;
