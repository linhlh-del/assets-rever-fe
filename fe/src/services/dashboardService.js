// services/dashboardService.js
import { apiClient } from "@/services/api";

// GET /api/dashboard
// BE trả về: { summary: {...}, categoryStats: [...], departmentStats: [...], statusStats: [...] }
// export const getDashboardStats = async () => {
//   const data = await apiClient.get("/dashboard");
//   return data; // ✅ apiClient.get() đã trả về dữ liệu trực tiếp
// };

export const getDashboardStats = async () => {
  const response = await apiClient.get("/api/dashboard");
  return response; // ✅ không cần .data
};
