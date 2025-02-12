import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./assets/components/Home";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import FamilyDashboard from "./assets/components/FamilyDashboard";
import CaregiverDashboard from "./assets/components/CaregiverDashboard";
import CaregiverDisplay from "./assets/components/CaregiverDisplay";
import Logout from "./assets/components/Logout";
import CaregiverSearchAndBook from "./assets/components/caregiversearchandbook";
import ViewAppointments from "./assets/components/ViewAppointments";
import ManageAppointments from "./assets/components/ManageAppoinments";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<CaregiverDisplay />} />
        <Route path="/family-dashboard" element={<FamilyDashboard />} />
        <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
   
        <Route path="/logout" element={<Logout />} />
        <Route path="/search-caregivers" element={<CaregiverSearchAndBook />} />
        <Route path="/view-appointments" element={<ViewAppointments/>}/>
        <Route path="/manage-appointments" element={<ManageAppointments/>}/>
      </Routes>
    </Router>
  );
}

export default App;
