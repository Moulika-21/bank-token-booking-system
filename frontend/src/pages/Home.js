import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/home.css"; // CSS file for styling

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Bank Token Booking System</h1>

      <div className="card-grid">
        <div className="home-card" onClick={() => navigate("/token-booking")}>
          <h2>Token Booking</h2>
          <p>Book your bank deposit token quickly.</p>
        </div>

        <div className="home-card" onClick={() => navigate("/my-tokens")}>
          <h2>My Tokens</h2>
          <p>View and manage your booked tokens.</p>
        </div>

        <div className="home-card" onClick={() => navigate("/profile")}>
          <h2>My Profile</h2>
          <p>View and update your account details.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
