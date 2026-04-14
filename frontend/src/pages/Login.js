import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../components/Login.css"; // New CSS file


const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", {
        email,
        password,
      }, { withCredentials: true });

      const accessToken = res.data.accessToken || res.data.token || res.data.access;
      const userId = res.data.userId;
      const role = res.data.role;

      const user = { id: userId, role, email };
      login({ accessToken, user });

      window._ACCESS_TOKEN = accessToken;
      // localStorage.setItem("isLoggedIn", "true");   // <-- quick flag
      // localStorage.setItem("userId", String(userId)); // optional
      // localStorage.setItem("role", String(role));

      // if (token) {
      //   localStorage.setItem("token", token);
      //   localStorage.setItem("userId", String(userId));
      //   localStorage.setItem("role", String(role));
      // }
      // const userRes = await axios.get(
      //   `http://localhost:8083/api/users/id/${res.data.userId}`
      // );
      // localStorage.setItem("role", userRes.data.role);

      setMessage("Login successful ✅");
      // navigate("/");
      setTimeout(() => {
        navigate("/");
      }, 0);

      // window.location.reload();
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      if (err.response && err.response.status === 401) {
        setMessage("Invalid email or password ❌");
      } else {
        setMessage("Login failed. Please try again ⚠️", err);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2> Login</h2>
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
            placeholder=" Password"
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
