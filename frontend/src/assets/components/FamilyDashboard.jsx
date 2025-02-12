import React from "react";
import { Link } from "react-router-dom"; // For navigation
import "./dashboardStyles.css"; // Common CSS for both dashboards
import "./Logout";


const FamilyDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Family Member Dashboard</h1>
        <nav className="dashboard-nav">
          <ul>
            <li><Link to="/search-caregivers">Search and Book Caregivers</Link></li>
            <li><Link to="/manage-appointments">Manage Appointments</Link></li>
            
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>
      <main className="dashboard-content">
        <p>Welcome to your Family Member Dashboard! Here you can:</p>
        <ul>
          <li>Search and book caregivers based on availability and expertise.</li>
          <li>Manage your current and upcoming appointments.</li>
         
        
        </ul>
      </main>
      
    </div>
  );
};

export default FamilyDashboard;