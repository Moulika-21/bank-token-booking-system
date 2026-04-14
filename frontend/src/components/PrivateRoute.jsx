import React from "react";
import {Navigate} from 'react-router-dom';
import { useAuth } from "../AuthContext";

// const PrivateRoute = ({children}) => {
//     const token =localStorage.getItem("token");
//     return token ? children : <Navigate to="/login" />;
// };

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  // Wait until auth check completes (prevents redirect flashing)
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
