import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./api/axios";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // const [user, setUser] = useState(() => {
  //   const s = localStorage.getItem("user");
  //   return s ? JSON.parse(s) : null;
  // });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function initAuth() {
      try {
        const hasCookie = document.cookie.includes("refreshToken");

        if (!hasCookie) {
          console.log("No refresh token, skipping refresh");
          if (mounted) setLoading(false);
          return;
        }
        // 1️⃣ Refresh access token using cookie
        const refreshRes = await api.post("/users/auth/refresh",{},
        { withCredentials: true });
        const token = refreshRes.data.accessToken;

        window._ACCESS_TOKEN = token;
        setAccessToken(token);

        // 2️⃣ Fetch logged-in user
        const meRes = await api.get("/users/me");
        setUser(meRes.data);

      } catch (err) {
        console.error("REFRESH FAILED", err?.response?.status);
        window._ACCESS_TOKEN = null;
        setUser(null);
        setAccessToken(null);
      } finally {
        if(mounted) setLoading(false);
      }
    }

    initAuth();
    return () =>{mounted=false;};
  }, []);

  // useEffect(() => {
  //   async function init() {
  //     try {
  //       // Try refresh (backend will read httpOnly cookie)
  //       const res = await api.post("/auth/refresh", {}, { withCredentials: true });
  //       const token = res.data.accessToken;
  //       window._ACCESS_TOKEN = token;
  //       setAccessToken(token);

  //       // Fetch user details
  //       const me = await api.get("/users/me");
  //       setUser(me.data);
  //       localStorage.setItem("user", JSON.stringify(me.data));
  //     } catch (err) {
  //       window._ACCESS_TOKEN = null;
  //       setAccessToken(null);
  //       setUser(null);
  //       localStorage.removeItem("user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   init();
  // }, []);

  // const login = ({ accessToken: token, user: u }) => {
  //   window._ACCESS_TOKEN = token;
  //   setAccessToken(token);
  //   setUser(u);
  //   localStorage.setItem("user", JSON.stringify(u));
  //   localStorage.setItem("userId", String(u.id));
  //   localStorage.setItem("role", String(u.role));
  // };
  const login = (loginResponse) => {
    window._ACCESS_TOKEN = loginResponse.accessToken;
    setAccessToken(loginResponse.accessToken);
    setUser(loginResponse.user);
  };

  // const logout = async () => {
  //   window._ACCESS_TOKEN = null;
  //   setAccessToken(null);
  //   setUser(null);
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("userId");
  //   localStorage.removeItem("role");
  //   // optional: call backend to clear refresh cookie
  //   try { await api.post("/auth/logout", {}, { withCredentials: true }); } catch(e) {}
  //   window.location.href = "/login";
  // };
  const logout = async () => {
    window._ACCESS_TOKEN = null;
    setUser(null);
    setAccessToken(null);
    localStorage.clear();
    window.location.href = "/login";
    // navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
