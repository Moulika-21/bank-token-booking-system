import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import "../components/home.css"; 
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({name: ""});
  
  useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        axios
          .get(`http://localhost:8083/api/users/id/${userId}`)
          .then((res) => setUser(res.data))
          .catch((err) => {console.error("Error fetching user:", err);
          setUser({name:""});
       });
      } else{
        setUser({name:""});
      }
    }, []);
  const role = localStorage.getItem("role");
  console.log("Role in HomePage:", role);


  return (
    <div className="layout-wrapper">
    <div className="page-wrapper">
    <div className="home-container">
      {user.name && <h1>Welcome {user.name}!</h1>}
      <h1 className="home-title">Welcome to Bank Token Booking System</h1>
     <div className="description">
      <p>
        Say goodbye to long queues at the bank! With our Bank Token Management System, you can book your service token online and visit the branch only when your turn is near.
      </p>

      <ul className="features-list">
        <li><strong>Quick Registration & Login</strong> - Create your account and access services anytime.</li>
        <li><strong>Book Tokens Instantly</strong> - Reserve a token for deposit transactions with just a few clicks.</li>
        <li><strong>Track Your Tokens</strong> - Stay updated on your token number and waiting time.</li>
        <li><strong>Smart Notifications</strong> - Get real-time updates on your token status.</li>
        <li><strong>Faster Service</strong> - Save time and avoid unnecessary waiting at the branch.</li>
      </ul>

      <p>
        Our goal is to make banking more convenient, efficient, and hassle-free for every customer.
      </p>
    </div>

      {!role && (
        <div className="visitor-section">
          <p className="visitor-text">
            Book your bank deposit token online and avoid waiting in long queues.
          </p>
          <div className="visitor-buttons">
            <button className="btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        </div>
      )}
      
      <div className="card-grid">
        {role && role.toLowerCase().includes("user") && (
          <>
            
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
          </>
        )}

        {/* Admin role cards */}
        {role && role.toLowerCase().includes("admin") && (
          <>
            <div className="home-card" onClick={() => navigate("admin/token-summary")}>
              <h2>Summary</h2>
              <p>View today’s token summary and reports.</p>
            </div>

            <div className="home-card" onClick={() => navigate("/admin-dashboard")}>
              <h2>Admin Dashboard</h2>
              <p>Manage all user tokens and update status.</p>
            </div>
          </>
        )}
        {!role && (
          <>
            <div className="home-card disabled">
              <h2>Token Booking</h2>
              <p>Login to book your token.</p>
            </div>
            <div className="home-card disabled">
              <h2>My Tokens</h2>
              <p>Login to view your booked tokens.</p>
            </div>
            <div className="home-card disabled">
              <h2>My Profile</h2>
              <p>Login to update your account details.</p>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
    <footer className="footer">
      &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
    </footer>
    </div>
  );
}

export default HomePage;

