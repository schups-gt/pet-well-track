import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // endereço do servidor do Bruno
  withCredentials: true, // permite cookies de sessão
});

export default api;
