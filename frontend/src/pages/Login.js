import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Login.css"; // New CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8083/api/users/login", {
        email,
        password,
      });

      const token = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(res.data.userId));

      const userRes = await axios.get(
        `http://localhost:8083/api/users/id/${res.data.userId}`
      );
      localStorage.setItem("role", userRes.data.role);

      setMessage("Login successful ✅");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage("Invalid email or password ❌");
      } else {
        setMessage("Login failed. Please try again ⚠️");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>🔐 Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="🔑 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
