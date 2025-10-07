import axios from "axios";


const API = axios.create({
  baseURL: "https://primetrade-ai-assignment-se3d.onrender.com || http://localhost:5000",
  withCredentials: true,
});

// attach token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
