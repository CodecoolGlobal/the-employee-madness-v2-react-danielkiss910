// Az alapvető React és ReactDOM modulok importálása
import React from "react";
import ReactDOM from "react-dom/client";

// React alkalmazásunkhoz szükséges modulok importálása a react-router-dom-ból
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Az alkalmazásunk egyéb moduljainak importálása
import reportWebVitals from "./reportWebVitals";
import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EquipmentList from "./Pages/EquipmentList";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EquipmentUpdater from "./Pages/EquipmentUpdater";
import "./index.css";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";

// Az alkalmazás útválasztó konfigurációjának létrehozása
const router = createBrowserRouter([
  {
    path: "/", // Az alapértelmezett útvonal
    element: <Layout />, // Az alkalmazás gyökérelem (Layout)
    errorElement: <ErrorPage />, // Az hibás útvonal esetén megjelenítendő elem (ErrorPage)
    children: [
      {
        path: "/", // Az útvonal az alkalmazás főoldalához
        element: <EmployeeList />, // Az alkalmazás főoldala (EmployeeList)
      },
      {
        path: "/create", // Az útvonal az új alkalmazott létrehozásához
        element: <EmployeeCreator />, // Az új alkalmazott létrehozásának oldala (EmployeeCreator)
      },
      {
        path: "/update/:id", // Az útvonal egy alkalmazott frissítéséhez, az :id paraméter az alkalmazott azonosítója
        element: <EmployeeUpdater />, // Az alkalmazott frissítés oldala (EmployeeUpdater)
      },
      {
        path: "/table-test", // Az útvonal a táblázat teszt oldalhoz
        element: <TableTest />, // A táblázat teszt oldala (TableTest)
      },
      {
        path: "/form-test", // Az útvonal a űrlap teszt oldalhoz
        element: <FormTest />, // Az űrlap teszt oldala (FormTest)
      },
      {
        path: "/equipment", // Az útvonal az eszközök listájához
        element: <EquipmentList />, // Az eszközök listájának oldala (EquipmentList)
      },
      {
        path: "/createequipment", // Az útvonal az új eszköz létrehozásához
        element: <EquipmentCreator />, // Az új eszköz létrehozásának oldala (EquipmentCreator)
      },
      {
        path: "/update-equipment/:id", // Az útvonal egy eszköz frissítéséhez, az :id paraméter az eszköz azonosítója
        element: <EquipmentUpdater />, // Az eszköz frissítés oldala (EquipmentUpdater)
      },
    ],
  },
]);

// Az alkalmazás gyökér elemének elkészítése és renderelése a DOM-ba
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Alkalmazás teljesítményének méréséhez szükséges függvény hívása
reportWebVitals();
