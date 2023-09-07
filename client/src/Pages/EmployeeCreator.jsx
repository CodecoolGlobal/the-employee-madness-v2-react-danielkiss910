import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

const createEmployee = (employee) => {
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
  const [colours, setColours] = useState([]);
  const [favoriteBrands, setfavoriteBrands] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetch("/api/colours")
    .then((res) => res.json())
    .then((data) => setColours(data))
    .catch((err) => console.error("Error fetching colours", err));
  }, []);

  useEffect(() => {
    fetch("/api/favoriteBrands")
    .then((res) => res.json())
    .then((data) => setfavoriteBrands(data))
    .catch((err) => console.error("Error fetching favourite brands", err));
  }, []);

  useEffect(() => {
    fetch("/api/equipment")
    .then((res) => res.json())
    .then((data) => setEquipment(data))
    .catch((err) => console.error("Error fetching equipment", err));
  }, []);

  const handleCreateEmployee = (employee) => {
    setLoading(true);

    createEmployee(employee)
      .then(() => {
        setLoading(false);
        navigate("/");
      })
  };

  return (
    <EmployeeForm
      onCancel={() => navigate("/")}
      disabled={loading}
      favouriteColours={colours}
      favoriteBrands={favoriteBrands}
      assignedEquipment={equipment}
      allowAddKittens={false}
      onSave={handleCreateEmployee}
    />
  );
};

export default EmployeeCreator;
