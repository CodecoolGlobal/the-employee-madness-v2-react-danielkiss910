import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// Employees
import Layout from "./Pages/Layout";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EmployeeSearch from "./Pages/EmployeeSearch";
import TopPaidPage from "./Pages/TopPaidPage";
import MissingEmployees from "./Pages/MissingEmployees";
import EmployeeAddressPage from "./Pages/EmployeeAddressPage";
// Equipment
import EquipmentList from "./Pages/EquipmentList";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EquipmentUpdater from "./Pages/EquipmentUpdater";
// Tools
import ToolsPage from "./Pages/ToolsList";
import ToolDetailsPage from "./Pages/ToolDetailsPage";
// Kittens
import KittensList from "./Pages/KittensList";
import EmployeeKittens from "./Pages/EmployeeKittens";
// Board Games
import BoardGameCreator from "./Pages/BoardGameCreator";
import BoardGameTable from "./Components/BoardGameTable/BoardGameTable";
import GameDetails from "./Pages/GameDetails";
// Error & Test
import ErrorPage from "./Pages/ErrorPage";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";
// Divisions
import DivisionCreator from "./Pages/DivisionCreator";
import DivisionTable from "./Components/DivisionTable/DivisionTable";
import DivisionUpdater from "./Pages/DivisionUpdater";
// Pets
import PetsPage from "./Pages/PetsPage";
// Cars
import CarsPage from "./Pages/CarsPage";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
          {/* Employees */}
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeeList />} />
          <Route path="/create" element={<EmployeeCreator />} />
          <Route path="/update/:id" element={<EmployeeUpdater />} />
          <Route path="/search/:employeeSearch" element={<EmployeeSearch />} />
          <Route path="/top-paid" element={<TopPaidPage />} />
          <Route path="/missing" element={<MissingEmployees />} />
          <Route path="/employees/:id/address" element={<EmployeeAddressPage />} />
          {/* Equipment */}
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/createequipment" element={<EquipmentCreator />} />
          <Route path="/update-equipment/:id" element={<EquipmentUpdater />} />
          {/* Tools */}
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:id" element={<ToolDetailsPage />} />
          {/* Kittens */}
          <Route path="/kittens" element={<KittensList />} />
          <Route path="/kittens/:employeeId" element={<EmployeeKittens />} />
          {/* Games */}
          <Route path="/games" element={<BoardGameCreator />} />
          <Route path="/games-list" element={<BoardGameTable />} />
          <Route path="/games-list/:id" element={< GameDetails />} />
          {/* Divisions */}
          <Route path="/divisions" element={< DivisionTable />} />
          <Route path="/division-creator" element={< DivisionCreator />} />
          <Route path="/division-updater/:id" element={< DivisionUpdater />} />
          {/* Error & Test */}
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/table-test" element={<TableTest />} />
          <Route path="/form-test" element={<FormTest />} />
          {/* Pets */}
          <Route path="/pets" element={<PetsPage />} />
          {/* Cars */}
          <Route path="/cars" element={<CarsPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
