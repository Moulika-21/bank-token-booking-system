// import React,{useEffect,useState} from "react";
// import { useNavigate } from "react-router-dom";
// import "../components/home.css"; 
// import axios from "axios";

// function HomePage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({name: ""});
  
//   useEffect(() => {
//       const userId = localStorage.getItem("userId");
//       if (userId) {
//         axios
//           .get(`http://localhost:8083/api/users/id/${userId}`)
//           .then((res) => setUser(res.data))
//           .catch((err) => {console.error("Error fetching user:", err);
//           setUser({name:""});
//        });
//       } else{
//         setUser({name:""});
//       }
//     }, []);
//   const role = localStorage.getItem("role");
//   console.log("Role in HomePage:", role);


//   return (
//     <div className="layout-wrapper">
//     <div className="page-wrapper">
//     <div className="home-container">
//       {user.name && <h1>Welcome {user.name}!</h1>}
//       <h1 className="home-title">Welcome to Bank Token Booking System</h1>
//      <div className="description">
//       <p>
//         Say goodbye to long queues at the bank! With our Bank Token Management System, you can book your service token online and visit the branch only when your turn is near.
//       </p>

//       <ul className="features-list">
//         <li><strong>Quick Registration & Login</strong> - Create your account and access services anytime.</li>
//         <li><strong>Book Tokens Instantly</strong> - Reserve a token for deposit transactions with just a few clicks.</li>
//         <li><strong>Track Your Tokens</strong> - Stay updated on your token number and waiting time.</li>
//         <li><strong>Smart Notifications</strong> - Get real-time updates on your token status.</li>
//         <li><strong>Faster Service</strong> - Save time and avoid unnecessary waiting at the branch.</li>
//       </ul>

//       <p>
//         Our goal is to make banking more convenient, efficient, and hassle-free for every customer.
//       </p>
//     </div>

//       {!role && (
//         <div className="visitor-section">
//           <p className="visitor-text">
//             Book your bank deposit token online and avoid waiting in long queues.
//           </p>
//           <div className="visitor-buttons">
//             <button className="btn" onClick={() => navigate("/login")}>
//               Login
//             </button>
//             <button className="btn btn-outline" onClick={() => navigate("/register")}>
//               Sign Up
//             </button>
//           </div>
//         </div>
//       )}
      
//       <div className="card-grid">
//         {role && role.toLowerCase().includes("user") && (
//           <>
            
//             <div className="home-card" onClick={() => navigate("/token-booking")}>
//               <h2>Token Booking</h2>
//               <p>Book your bank deposit token quickly.</p>
//             </div>

//             <div className="home-card" onClick={() => navigate("/my-tokens")}>
//               <h2>My Tokens</h2>
//               <p>View and manage your booked tokens.</p>
//             </div>

//             <div className="home-card" onClick={() => navigate("/profile")}>
//               <h2>My Profile</h2>
//               <p>View and update your account details.</p>
//             </div>
//           </>
//         )}

//         {/* Admin role cards */}
//         {role && role.toLowerCase().includes("admin") && (
//           <>
//             <div className="home-card" onClick={() => navigate("admin/token-summary")}>
//               <h2>Summary</h2>
//               <p>View today’s token summary and reports.</p>
//             </div>

//             <div className="home-card" onClick={() => navigate("/admin-dashboard")}>
//               <h2>Admin Dashboard</h2>
//               <p>Manage all user tokens and update status.</p>
//             </div>
//           </>
//         )}
//         {!role && (
//           <>
//             <div className="home-card disabled">
//               <h2>Token Booking</h2>
//               <p>Login to book your token.</p>
//             </div>
//             <div className="home-card disabled">
//               <h2>My Tokens</h2>
//               <p>Login to view your booked tokens.</p>
//             </div>
//             <div className="home-card disabled">
//               <h2>My Profile</h2>
//               <p>Login to update your account details.</p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//     </div>
    
//     <footer className="footer">
//       &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
//     </footer>
//     </div>
//   );
// }

// export default HomePage;

// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/home.css";
import api from "../api/axios"; // use your axios instance with withCredentials:true
import { useAuth } from "../AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth(); // cookie-first auth
  const [user, setUser] = useState({ name: "" });
  const [loading, setLoading] = useState(true); // loading for local fetch (not the authLoading)

  // Keep local user state in sync with authUser, and optionally fetch the latest full user object.
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      

      // If AuthContext already provides user, use it first
      if (authUser) {
        if (mounted) setUser(authUser);
        if (mounted) setLoading(false);
        return;
      }

      // If AuthContext is still checking session, wait until it finishes
      if (authLoading) {
        // keep loading until auth finishes — use effect dependency to run again
        if (mounted) setLoading(true);
        return;
      }

      // Not logged in
      if (mounted) {
        setUser({ name: "" });
        setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [authUser, authLoading]);

  // useEffect(() => {
  //   let mounted = true;

  //   if (!authUser) return; // ✅ STOP early

  //   const fetchUser = async () => {
  //     try {
  //       setUser(authUser);
  //       // const resp = await api.get(`/users/id/${authUser.id}`);
  //       // if (mounted) setUser(resp.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchUser();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [authUser]); // ❗ REMOVE authLoading

  // derive role from user object (no localStorage usage)
  const roleRaw = user?.role ?? (user?.roles ? user.roles[0] : null);
  const role = roleRaw ? String(roleRaw).toLowerCase() : "";

  // optional: while both authLoading and local loading, show spinner or placeholder
  if (authLoading || loading) {
    return (
      <div className="layout-wrapper">
        <div className="page-wrapper">
          <div className="home-container">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="layout-wrapper">
  //     <div className="page-wrapper">
  //       <div className="home-container">
  //         {user?.name && <h1>Welcome {user.name}!</h1>}
  //         <h1 className="home-title">Welcome to Bank Token Booking System</h1>
  //         <div className="description">
  //           <p>
  //             Say goodbye to long queues at the bank! With our Bank Token Management System, you can book your service token online and visit the branch only when your turn is near.
  //           </p>

  //           <ul className="features-list">
  //             <li><strong>Quick Registration & Login</strong> - Create your account and access services anytime.</li>
  //             <li><strong>Book Tokens Instantly</strong> - Reserve a token for deposit transactions with just a few clicks.</li>
  //             <li><strong>Track Your Tokens</strong> - Stay updated on your token number and waiting time.</li>
  //             <li><strong>Smart Notifications</strong> - Get real-time updates on your token status.</li>
  //             <li><strong>Faster Service</strong> - Save time and avoid unnecessary waiting at the branch.</li>
  //           </ul>

  //           <p>
  //             Our goal is to make banking more convenient, efficient, and hassle-free for every customer.
  //           </p>
  //         </div>

  //         {!role && (
  //           <div className="visitor-section">
  //             <p className="visitor-text">
  //               Book your bank deposit token online and avoid waiting in long queues.
  //             </p>
  //             <div className="visitor-buttons">
  //               <button className="btn" onClick={() => navigate("/login")}>
  //                 Login
  //               </button>
  //               <button className="btn btn-outline" onClick={() => navigate("/register")}>
  //                 Sign Up
  //               </button>
  //             </div>
  //           </div>
  //         )}

  //         <div className="card-grid">
  //           {role.includes("user") && (
  //             <>
  //               <div className="home-card" onClick={() => navigate("/token-booking")}>
  //                 <h2>Token Booking</h2>
  //                 <p>Book your bank deposit token quickly.</p>
  //               </div>

  //               <div className="home-card" onClick={() => navigate("/my-tokens")}>
  //                 <h2>My Tokens</h2>
  //                 <p>View and manage your booked tokens.</p>
  //               </div>

  //               <div className="home-card" onClick={() => navigate("/profile")}>
  //                 <h2>My Profile</h2>
  //                 <p>View and update your account details.</p>
  //               </div>
  //             </>
  //           )}

  //           {/* Admin role cards */}
  //           {role.includes("admin") && (
  //             <>
  //               <div className="home-card" onClick={() => navigate("admin/token-summary")}>
  //                 <h2>Summary</h2>
  //                 <p>View today’s token summary and reports.</p>
  //               </div>

  //               <div className="home-card" onClick={() => navigate("/admin-dashboard")}>
  //                 <h2>Admin Dashboard</h2>
  //                 <p>Manage all user tokens and update status.</p>
  //               </div>
  //             </>
  //           )}

  //           {!role && (
  //             <>
  //               <div className="home-card disabled">
  //                 <h2>Token Booking</h2>
  //                 <p>Login to book your token.</p>
  //               </div>
  //               <div className="home-card disabled">
  //                 <h2>My Tokens</h2>
  //                 <p>Login to view your booked tokens.</p>
  //               </div>
  //               <div className="home-card disabled">
  //                 <h2>My Profile</h2>
  //                 <p>Login to update your account details.</p>
  //               </div>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </div>

  //     <footer className="footer">
  //       &copy; {new Date().getFullYear()} Bank Token Booking System. All rights reserved.
  //     </footer>
  //   </div>
  // );
  return (
  <div className="home-page">

    {/* HERO SECTION */}
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome, {user?.name} 👋</h1>
        <h2>Bank Token Booking System</h2>
        <p>
          Skip long queues. Book your bank deposit token online and
          arrive exactly when it’s your turn.
        </p>
      </div>
    </section>

    {/* 👇 EVERYTHING BELOW HERO HAS BACKGROUND IMAGE */}
    <div className="content-with-bg">

      {/* QUICK ACTIONS */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>

        <div className="action-grid">
          <div className="action-card" onClick={() => navigate("/token-booking")}>
            <h4>Book Token</h4>
            <p>Reserve your deposit token in seconds.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/my-tokens")}>
            <h4>My Tokens</h4>
            <p>Track your booked tokens & status.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/profile")}>
            <h4>My Profile</h4>
            <p>Manage your personal details.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h3>Why Use This System?</h3>

        <div className="feature-grid">
          <div className="feature-box">⏱ Save Time</div>
          <div className="feature-box">🔔 Live Updates</div>
          <div className="feature-box">🏦 Bank-Friendly</div>
          <div className="feature-box">📱 Easy Access</div>
        </div>
      </section>

    </div>

    <footer className="home-footer">
      © {new Date().getFullYear()} Bank Token Booking System
    </footer>
  </div>
);


}

export default HomePage;
