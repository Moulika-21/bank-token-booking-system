import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const role = user?.role?.toUpperCase();

  return (
    <div className="navbar">
      <h2 className="logo">Bank Token System</h2>

      <ul className="nav-links">
        {!isLoggedIn && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Signup</Link></li>
          </>
        )}

        {isLoggedIn && role === "USER" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/token-booking">Book Token</Link></li>
            <li><Link to="/my-tokens">My Tokens</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <button className="navbar-logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {isLoggedIn && role === "ADMIN" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/admin/token-summary">Summary</Link></li>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <button className="navbar-logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
