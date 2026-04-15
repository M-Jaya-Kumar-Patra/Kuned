import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// ✅ GLOBAL FLAG

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
  if (!sessionStorage.getItem("redirecting")) {
    sessionStorage.setItem("redirecting", "true");

    alert("Session expired. Please login again.");

    localStorage.removeItem("token");

    window.location.href = "/login";
  }
}

    return Promise.reject(error);
  }
);

export default api;