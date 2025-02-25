import axios from "axios";

// Obter a URL da API a partir das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

// Log da URL da API para debugging durante desenvolvimento
if (import.meta.env.DEV) {
  console.log("API URL:", API_URL);
}