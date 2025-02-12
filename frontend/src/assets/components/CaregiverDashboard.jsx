import React from "react";
import { Link } from "react-router-dom"; // For navigation
import "./dashboardStyles.css"; // Common CSS for both dashboards
import "./Logout";

const CaregiverDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Caregiver Dashboard</h1>
        <nav className="dashboard-nav">
          <ul>
            <li><Link to="/view-appointments">View Appointments</Link></li>
          
            <li><Link to="/profile">View Profile</Link></li> {/* New Link */}
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>
      <main className="dashboard-content">
        <p>Welcome to your Caregiver Dashboard! Here you can:</p>
        <ul>
          <li>View and manage your upcoming appointments.</li>
          <li>Update your personal information and profile details.</li>
        </ul>
      </main>
    </div>
  );
};

export default CaregiverDashboard;
