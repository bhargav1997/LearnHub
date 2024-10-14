import axios from "axios";
import { CONFIG } from "../config";

const API_URL = CONFIG.API_URL;

export const createLearningTask = async (taskData) => {
   const token = localStorage.getItem("token");
   const config = {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
   };

   try {
      const response = await axios.post(`${API_URL}/tasks/learning-task`, taskData, config);
      return response.data;
   } catch (error) {
      throw error.response.data;
   }
};
