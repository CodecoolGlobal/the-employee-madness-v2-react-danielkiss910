import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const positionData = {
    labels: Object.keys(dashboardData.positions),
    datasets: [
      {
        label: 'Position Distribution',
        data: Object.values(dashboardData.positions),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const levelData = {
    labels: Object.keys(dashboardData.levels),
    datasets: [
      {
        label: 'Level Distribution',
        data: Object.values(dashboardData.levels),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const equipmentData = {
    labels: dashboardData.equipmentStatistics.map(stat => stat.name),
    datasets: [
      {
        label: 'Equipment Statistics',
        data: dashboardData.equipmentStatistics.map(stat => stat.count),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-item">
        <h2>Total Employees</h2>
        <p>{dashboardData.totalEmployees}</p>
      </div>
      <div className="dashboard-item">
        <h2>Position Distribution</h2>
        <Bar data={positionData} />
      </div>
      <div className="dashboard-item">
        <h2>Level Distribution</h2>
        <Bar data={levelData} />
      </div>
      <div className="dashboard-item">
        <h2>Recent Employees</h2>
        <ul>
          {dashboardData.recentlyAddedEmployees.map((employee) => (
            <li key={employee.id}>
              {employee.name} - {employee.position}
            </li>
          ))}
        </ul>
      </div>
      {/* Equipment Statistics Section */}
      <div className="dashboard-item">
        <h2>Equipment Statistics</h2>
        <Bar data={equipmentData} />
      </div>
    </div>
  );
};

export default DashboardPage;
