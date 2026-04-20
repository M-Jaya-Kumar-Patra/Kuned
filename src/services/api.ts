import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      if (!sessionStorage.getItem("redirecting")) {
        sessionStorage.setItem("redirecting", "true");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
