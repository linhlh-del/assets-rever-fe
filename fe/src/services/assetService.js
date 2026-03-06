// services/assetService.js
import { apiClient } from "@/services/api";

// GET /api/assets
export const getAssets = async ({
  search = "",
  category = null,
  status = null,
  department = null,
  page = 1, // ✅ fix: default page=1 không phải 10
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search?.trim()) params.append("search", search.trim());
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (department) params.append("department", department);

  // axios: response.data = { assets: [...], pagination: {...} }
  const response = await apiClient.get(`/assets?${params}`);
  return response.data; // ✅ trả về { assets, pagination }
};

// GET /api/assets/:id
export const getAsset = async (assetId) => {
  const response = await apiClient.get(`/assets/${assetId}`);
  return response.data; // ✅ trả về asset object trực tiếp
};

// POST /api/assets
export const createAsset = async (assetData) => {
  const response = await apiClient.post("/assets", assetData);
  return response.data; // ✅ trả về asset object trực tiếp
};

// PUT /api/assets/:id  — dùng asset.id (UUID)
export const updateAsset = async (assetId, assetData) => {
  const response = await apiClient.put(`/assets/${assetId}`, assetData);
  return response.data; // ✅
};

// DELETE /api/assets/:id
export const deleteAsset = async (assetId) => {
  const response = await apiClient.delete(`/assets/${assetId}`);
  return response.data;
};

// POST /api/assets/:id/assign
export const assignAsset = async (assetId, { employeeCode }) => {
  const response = await apiClient.post(`/assets/${assetId}/assign`, {
    employeeCode,
  });
  return response.data;
};

// POST /api/assets/:id/return
export const returnAsset = async (assetId, { returnNotes } = {}) => {
  const response = await apiClient.post(`/assets/${assetId}/return`, {
    returnNotes,
  });
  return response.data;
};
