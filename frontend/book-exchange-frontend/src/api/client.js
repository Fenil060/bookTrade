import axios from "axios";

export const clientServer = axios.create({
  baseURL: "https://booktrade-t2ng.onrender.com",
  headers: { "Content-Type": "application/json" },
});

clientServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
