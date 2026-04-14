import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8083/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = window._ACCESS_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((res) => res, async (err) => {
  const originalRequest = err.config;
  if (!originalRequest) return Promise.reject(err);

  if (err.response && (err.response.status === 401 || err.response.status === 403) && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshRes = await axios.post("http://localhost:8083/api/users/auth/refresh", {}, { withCredentials: true });
      const newToken = refreshRes.data.accessToken;
      window._ACCESS_TOKEN = newToken;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      // refresh failed -> clear session and redirect
      window._ACCESS_TOKEN = null;
      localStorage.clear();
      // localStorage.removeItem("user");
      // localStorage.removeItem("userId");
      // localStorage.removeItem("role");
      window.location.href = "/login";
      return Promise.reject(err);
      // return Promise.reject(refreshErr);
    }
  }
  return Promise.reject(err);
});

export default api;
