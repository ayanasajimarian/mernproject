import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Logout logic
    localStorage.removeItem("userToken"); // Example: Remove token from localStorage
    sessionStorage.clear(); // Clear session storage if needed

    // Redirect to the home page
    navigate('/'); // Redirect to home page
  }, [navigate]);

  return null; // No button or UI to render
};

export default Logout;
