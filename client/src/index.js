import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EquipmentList from "./Pages/EquipmentList";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EquipmentUpdater from "./Pages/EquipmentUpdater";
import EmployeeSearch from "./Pages/EmployeeSearch";

import "./index.css";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";
import TopPaidPage from "./Pages/TopPaidPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeeList />} />
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/create" element={<EmployeeCreator />} />
          <Route path="/update/:id" element={<EmployeeUpdater />} />
          <Route path="/table-test" element={<TableTest />} />
          <Route path="/form-test" element={<FormTest />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/createequipment" element={<EquipmentCreator />} />
          <Route path="/update-equipment/:id" element={<EquipmentUpdater />} />
          <Route path="/search/:employeeSearch" element={<EmployeeSearch />} />
          <Route path="/top-paid" element={<TopPaidPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
