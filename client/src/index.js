// Importing essential React and ReactDOM modules
import React from "react";
import ReactDOM from "react-dom/client";

// Importing modules needed for routing in our React application
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing other modules for our application
import reportWebVitals from "./reportWebVitals";
import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EquipmentList from "./Pages/EquipmentList";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EquipmentUpdater from "./Pages/EquipmentUpdater";
import MissingEmployeesPage from "./Pages/MissingEmployeesPage";
import DashboardPage from "./Components/Dashboard/DashboardPage";
import "./index.css";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";

// Creating the router configuration for the application
const router = createBrowserRouter([
  {
    path: "/", // Default path
    element: <Layout />, // Root element of the application (Layout)
    errorElement: <ErrorPage />, // Element displayed in case of a wrong path (ErrorPage)
    children: [
      {
        path: "/", // Path for the application's main page
        element: <EmployeeList />, // Main page of the application (EmployeeList)
      },
      {
        path: "/create", // Path for creating a new employee
        element: <EmployeeCreator />, // Page for creating a new employee (EmployeeCreator)
      },
      {
        path: "/update/:id", // Path for updating an employee, :id is the employee's identifier
        element: <EmployeeUpdater />, // Page for updating an employee (EmployeeUpdater)
      },
      {
        path: "/table-test", // Path for the table test page
        element: <TableTest />, // Table test page (TableTest)
      },
      {
        path: "/form-test", // Path for the form test page
        element: <FormTest />, // Form test page (FormTest)
      },
      {
        path: "/equipment", // Path for the equipment list
        element: <EquipmentList />, // Page for the equipment list (EquipmentList)
      },
      {
        path: "/createequipment", // Path for creating a new equipment
        element: <EquipmentCreator />, // Page for creating a new equipment (EquipmentCreator)
      },
      {
        path: "/update-equipment/:id", // Path for updating an equipment, :id is the equipment's identifier
        element: <EquipmentUpdater />, // Page for updating an equipment (EquipmentUpdater)
      },
      {
        path: "/missing-employees", // Path for the missing employees page
        element: <MissingEmployeesPage />, // Page for viewing missing employees
      },
      {
        path: "/dashboard", // Path for the dashboard page
        element: <DashboardPage />, // Page for the dashboard (DashboardPage)
      },
    ],
  },
]);

// Creating the root element and rendering the application to the DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Function call needed to measure the application's performance
reportWebVitals();
