import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

// A function to post a new employee's data to the server
const createEmployee = (employee) => {
  console.log(employee);
  return fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State to hold data that will populate the form options
  const [colours, setColours] = useState([]);
  const [favoriteBrands, setfavoriteBrands] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch data for the colours dropdown/select in the form
  useEffect(() => {
    fetch("/api/colours")
    .then((res) => res.json())
    .then((data) => setColours(data))
    .catch((err) => console.error("Error fetching colours", err));
  }, []);

  // Fetch data for the favourite brands dropdown/select in the form
  useEffect(() => {
    fetch("/api/favoriteBrands")
    .then((res) => res.json())
    .then((data) => setfavoriteBrands(data))
    .catch((err) => console.error("Error fetching favourite brands", err));
  }, []);

  // Fetch data for the equipment dropdown/select in the form
  useEffect(() => {
    fetch("/api/equipment")
    .then((res) => res.json())
    .then((data) => setEquipment(data))
    .catch((err) => console.error("Error fetching equipment", err));
  }, []);

  // Fetch data for the board games dropdown/select in the form
  useEffect(() => {
    fetch("/api/games")
    .then((res) => res.json())
    .then((data) => setBoardGames(data))
    .catch((err) => console.error("Error fetching board games", err));
  }, []);

  // Fetch data for the divisions dropdown/select in the form
  useEffect(() => {
    fetch("/api/divisions")
    .then((res) => res.json())
    .then((data) => setDivisions(data))
    .catch((err) => console.error("Error fetching divisions", err));
  }, []);
  
  // Fetch data for the locations dropdown/select in the form
  useEffect(() => {
    fetch("/api/locations")
    .then((res) => res.json())
    .then((data) => setLocations(data))
    .catch((err) => console.error("Error fetching locations", err));
  }, []);


  // Handle the creation of a new employee
  const handleCreateEmployee = (employee) => {
    setLoading(true);

    createEmployee(employee)
      .then(() => {
        setLoading(false);
        navigate("/");
      })
  };


  // Render the EmployeeForm with the fetched data and event handlers
  return (
    <EmployeeForm
      onCancel={() => navigate("/")}
      disabled={loading}
      favouriteColours={colours}
      favoriteBrands={favoriteBrands}
      assignedEquipment={equipment}
      boardGames={boardGames}
      allowAddKittens={false} // Only allow adding kittens to existing employees on updater form
      onSave={handleCreateEmployee}
      divisions={divisions}
      locations={locations}
    />
  );
};

export default EmployeeCreator;
