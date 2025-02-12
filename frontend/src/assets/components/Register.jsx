import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection
import "./registerStyles.css"; // Link to the CSS file

const Register = () => {
  const [userType, setUserType] = useState("family"); // Default to family member
  const [contactNumber, setContactNumber] = useState(""); // State to handle contact number input
  const [caregiverDetails, setCaregiverDetails] = useState({
    skills: "",
    experience: "",
    place: "",
  }); // State for caregiver-specific fields
  const navigate = useNavigate(); // Create a navigate function for redirection

  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setCaregiverDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: document.querySelector('input[placeholder="Enter your username"]').value,
      email: document.querySelector('input[placeholder="Enter your email"]').value,
      password: document.querySelector('input[placeholder="Enter your password"]').value,
      contactNumber, // Add contact number to the form data
      userType,
      ...(userType === "caregiver" && caregiverDetails), // Add caregiver-specific fields only if userType is caregiver
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log(data);

        // Redirect to login page after successful registration
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-heading">Create an Account</h2>
        <p className="register-subheading">Join us as a Caregiver or Family Member</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter your contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Are you a Caregiver or a Family Member?</label>
            <select
              className="form-select"
              onChange={(e) => setUserType(e.target.value)}
              value={userType}
              required
            >
              <option value="family">Family Member</option>
              <option value="caregiver">Caregiver</option>
            </select>
          </div>

          {/* Conditional Fields for Caregiver */}
          {userType === "caregiver" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  name="skills"
                  value={caregiverDetails.skills}
                  onChange={handleCaregiverChange}
                  placeholder="Enter your skills (e.g., Nursing, CPR)"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  name="experience"
                  value={caregiverDetails.experience}
                  onChange={handleCaregiverChange}
                  placeholder="Enter your experience (in years)"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  name="place"
                  value={caregiverDetails.place}
                  onChange={handleCaregiverChange}
                  placeholder="Enter your place"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
