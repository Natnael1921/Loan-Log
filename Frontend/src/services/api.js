import axios from "axios";

const api = axios.create({
  baseURL: "https://loan-log-api.onrender.com/api",
});

export default api;
