import axios from "axios";
import { CONFIG } from "../config";

const API_BASE_URL = CONFIG.API_URL;

const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
   const token = localStorage.getItem("token"); // Assume we store the token in localStorage
   if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
   }
   return config;
});

export const fetchJourneys = () => api.get("/learning-journeys");
export const fetchJourney = (id) => api.get(`/learning-journeys/${id}`);
export const createJourney = (journeyData) => api.post("/learning-journeys", journeyData);
export const updateJourney = (id, journeyData) => api.put(`/learning-journeys/${id}`, journeyData);
export const deleteJourney = (id) => api.delete(`/learning-journeys/${id}`);

export default api;
