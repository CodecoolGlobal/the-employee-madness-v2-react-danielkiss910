import React, { useEffect, useState } from 'react';
import './DashboardPage.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from the backend API
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="metrics">
        <div className="metric">
          <h3>Total Employees</h3>
          <p>{metrics.totalEmployees}</p>
        </div>
        <div className="metric">
          <h3>Position Distribution</h3>
          <ul>
            {Object.entries(metrics.positions).map(([position, count]) => (
              <li key={position}>{position}: {count}</li>
            ))}
          </ul>
        </div>
        <div className="metric">
          <h3>Level Distribution</h3>
          <ul>
            {Object.entries(metrics.levels).map(([level, count]) => (
              <li key={level}>{level}: {count}</li>
            ))}
          </ul>
        </div>
        <div className="metric">
          <h3>Recently Added Employees</h3>
          <ul>
            {metrics.recentlyAddedEmployees.map(employee => (
              <li key={employee.id}>{employee.name} ({employee.position})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
