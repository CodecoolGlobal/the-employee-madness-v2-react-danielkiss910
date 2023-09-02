import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./EquipmentTable.css";

const EquipmentTable = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchEquipment = useCallback(async () => {
    try {
      const response = await axios.get("/api/equipment");
      setEquipment(response.data);
      setFilteredEquipment(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  useEffect(() => {
    const applyFilters = () => {
      let filteredItems = equipment;

      if (nameFilter) {
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }
      if (typeFilter) {
        filteredItems = filteredItems.filter(item =>
          item.type.toLowerCase().includes(typeFilter.toLowerCase())
        );
      }
      if (amountFilter) {
        filteredItems = filteredItems.filter(
          item => item.amount === parseInt(amountFilter)
        );
      }

      if (sortField) {
        const compareFunction = (a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (sortOrder === "asc") {
            if (sortField === "amount") {
              return aValue - bValue; // Compare numbers directly
            } else {
              return aValue.localeCompare(bValue);
            }
          } else {
            if (sortField === "amount") {
              return bValue - aValue;
            } else {
              return bValue.localeCompare(aValue);
            }
          }
        };
        filteredItems = filteredItems.sort(compareFunction);
      }

      setFilteredEquipment(filteredItems);
    };

    applyFilters();
  }, [nameFilter, typeFilter, amountFilter, equipment, sortField, sortOrder]);

  const handleSort = field => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="EquipmentTable">
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Type"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by Amount"
          value={amountFilter}
          onChange={e => setAmountFilter(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={() => handleSort("name")}
        className={sortField === "name" ? "active" : ""}>
        Sort by Name{" "}
        {sortField === "name" && sortOrder === "asc" ? (
          <span>&uarr;</span>
        ) : sortField === "name" && sortOrder === "desc" ? (
          <span>&darr;</span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => handleSort("type")}
        className={sortField === "type" ? "active" : ""}>
        Sort by Type{" "}
        {sortField === "type" && sortOrder === "asc" ? (
          <span>&uarr;</span>
        ) : sortField === "type" && sortOrder === "desc" ? (
          <span>&darr;</span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => handleSort("amount")}
        className={sortField === "amount" ? "active" : ""}>
        Sort by Amount{" "}
        {sortField === "amount" && sortOrder === "asc" ? (
          <span>&uarr;</span>
        ) : sortField === "amount" && sortOrder === "desc" ? (
          <span>&darr;</span>
        ) : null}
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
