import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./login.css"; // Link to the CSS file

const Login = () => {
  const [message, setMessage] = useState(""); // State to display login status message
  const navigate = useNavigate(); // For navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[placeholder="Enter your email"]').value;
    const password = document.querySelector('input[placeholder="Enter your password"]').value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data.user.userType);

      const user = data.user._id ;

     

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        console.log('usertype', data.user.userType);

        // Store email in localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("user",user);
        console.log(user);

        // Redirect based on user type
        if (data.user.userType === "family") {
          console.log("Redirecting to Family Dashboard...");
          navigate("/family-dashboard");
        } else if (data.user.userType === "caregiver") {
          navigate("/caregiver-dashboard");
        }
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-heading">Welcome Back</h2>
        <p className="login-subheading">Log in to continue</p>
        {message && <p className="login-message">{message}</p>} {/* Display login message */}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
