import { apiClient } from "@/services/api";

// Get all users with filters
export const getUsers = async ({
  search = "",
  department = null,
  role = null,
  // status = null,
  status = "active",
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (department) params.set("department_id", department);
  if (role) params.set("role", role);
  if (status !== null && status !== undefined && status !== "") {
    params.set("status", status);
  }
  params.set("page", page);
  params.set("limit", limit);

  console.log("📋 getUsers params:", params.toString()); // thêm dòng này
  const data = await apiClient.get(`/api/users?${params.toString()}`);

  // BE trả { success, data: { users: [...], pagination: { total, page, limit, pages } } }
  return {
    data: data?.data?.users || [],
    total: data?.data?.pagination?.total || 0,
    page: data?.data?.pagination?.page || page,
    limit: data?.data?.pagination?.limit || limit,
  };
};

// Get single user by employee_code
export const getUser = async (employeeCode) => {
  const data = await apiClient.get(`/api/users/${employeeCode}`);
  return data?.data?.user || data;
};

// Create user
export const createUser = async (userData) => {
  const data = await apiClient.post("/api/users", userData);
  return data?.data?.user || data;
};

// Update user
export const updateUser = async (employeeCode, userData) => {
  const data = await apiClient.put(`/api/users/${employeeCode}`, userData);
  return data?.data?.user || data;
};

// Delete user — soft delete (status = resigned)
export const deleteUser = async (employeeCode) => {
  const data = await apiClient.delete(`/api/users/${employeeCode}`);
  return data?.data?.user || data;
};

export const getUserAssetHistory = async (employeeCode) => {
  const data = await apiClient.get(`/api/users/${employeeCode}/asset-history`);
  return data?.data?.history || []; // ← đổi data.assets → data.history
};

// Bulk update users
export const bulkUpdateUsers = async (employeeIds, updateData) => {
  const data = await apiClient.put("/api/users/bulk", {
    employee_codes: employeeIds, // BE expect employee_codes
    ...updateData, // status hoặc department_id
  });
  return data?.data || [];
};
