// services/assetService.js
import { apiClient } from "@/services/api";

// GET /api/assets
export const getAssets = async ({
  search = "",
  category = null,
  status = null,
  department = null,
  page = 1,
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
  const response = await apiClient.get(`/api/assets?${params}`);
  return response.data; // { assets, pagination }
};

// GET /api/assets/:id
export const getAsset = async (assetId) => {
  const response = await apiClient.get(`/api/assets/${assetId}`);
  return response.data; // asset object trực tiếp
};

// GET /api/assets/:id/audit-trail
export const getAssetAuditTrail = async (assetId) => {
  const response = await apiClient.get(`/api/assets/${assetId}/audit-trail`);
  return response.data;
};

// POST /api/assets
export const createAsset = async (assetData) => {
  const response = await apiClient.post("/api/assets", assetData);
  return response.data;
};

// PUT /api/assets/:id — dùng asset.id (UUID)
export const updateAsset = async (assetId, assetData) => {
  const response = await apiClient.put(`/api/assets/${assetId}`, assetData);
  return response.data;
};

// DELETE /api/assets/:id
export const deleteAsset = async (assetId) => {
  const response = await apiClient.delete(`/api/assets/${assetId}`);
  return response.data;
};

// POST /api/assets/:id/assign
export const assignAsset = async (assetId, { employeeCode }) => {
  const response = await apiClient.post(`/api/assets/${assetId}/assign`, {
    employeeCode,
  });
  return response.data;
};

// POST /api/assets/:id/return
export const returnAsset = async (assetId, { returnNotes } = {}) => {
  const response = await apiClient.post(`/api/assets/${assetId}/return`, {
    returnNotes,
  });
  return response.data;
};

export const uploadAssetImages = async (assetId, files = []) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await apiClient.request(`/api/assets/${assetId}/images`, {
    method: "POST",
    headers: { "Content-Type": undefined },
    body: formData,
  });
  return response.data;
};
