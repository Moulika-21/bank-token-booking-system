import React,{useState, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import "./Navbar.css";

const Navbar =() => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (token && userRole) {
            setIsLoggedIn(true);
            setRole(userRole ? userRole.toUpperCase() : "");
        }
        else {
            setIsLoggedIn(false);
            setRole("");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
        window.location.reload();
    };

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

                {/* User Links */}
                {isLoggedIn && role === "USER" && (
                    <>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/token-booking">Book Token</Link></li>
                    <li><Link to="/my-tokens">My Tokens</Link></li>
                    <li><Link to="/profile">My Profile</Link></li>
                    {localStorage.getItem("token") && (
                        <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
                    )}
                    </>
                )}

                {/* Admin Links */}
                {isLoggedIn && role === "ADMIN" && (
                    <>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/admin/token-summary">Summary</Link></li>
                    <li><Link to="/admin-dashboard">Dashboard</Link></li>
                    {localStorage.getItem("token") && (
                        <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
                    )}
                    </>
                )}
                
            </ul>
        </div>
    );
};

export default Navbar;