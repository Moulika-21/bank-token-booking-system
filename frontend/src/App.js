import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute  from "./components/PrivateRoute";
import Login from './pages/Login';
import Register from "./pages/Register";
import TokenFilter from "./pages/TokenFilter";
import MyTokens from "./pages/MyTokens";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import TokenBooking from "./pages/TokenBooking";
import NotFound from "./components/NotFound";
import AdminTokenSummary from "./pages/AdminTokenSummary";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element ={<Register />} />
        <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/token-summary" element={<PrivateRoute><AdminTokenSummary/></PrivateRoute>} />
        <Route path="/token-booking" element={<PrivateRoute><TokenBooking /></PrivateRoute>} />
        <Route path="/filter-tokens" element={<PrivateRoute><TokenFilter /></PrivateRoute>} />
        <Route path="/my-tokens" element={<PrivateRoute><MyTokens /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>

  );
}

export default App;
