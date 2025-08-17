import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8083", // your backend URL
});

// Interceptor to catch expired/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token"); // clear token
      window.location.href = "/login";  // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
