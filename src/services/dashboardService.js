// services/dashboardService.js
import { apiClient } from "@/services/api";

export const getDashboardStats = async () => {
  const response = await apiClient.get("/api/dashboard");
  return response; // ✅ không cần .data
};
