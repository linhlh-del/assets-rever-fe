import { apiClient } from "@/services/api";

// Chuẩn hóa: apiClient trả về JSON body trực tiếp
// BE format: { success: true, data: { ... } }

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
  if (department) params.append("department_id", department);

  const res = await apiClient.get(`/api/assets?${params}`);
  // res = { success, data: { assets, pagination } }
  return {
    assets: res?.data?.assets || [],
    pagination: res?.data?.pagination || { total: 0, page, limit },
  };
};

export const getAsset = async (assetId) => {
  const res = await apiClient.get(`/api/assets/${assetId}`);
  return res?.data?.asset || res?.data || null;
};

export const getAssetAuditTrail = async (assetId) => {
  const res = await apiClient.get(`/api/assets/${assetId}/audit-trail`);
  return res?.data?.history || [];
};

export const createAsset = async (assetData) => {
  const res = await apiClient.post("/api/assets", assetData);
  return res?.data?.asset || res?.data;
};

export const updateAsset = async (assetId, assetData) => {
  const res = await apiClient.put(`/api/assets/${assetId}`, assetData);
  return res?.data?.asset || res?.data;
};

export const deleteAsset = async (assetId) => {
  const res = await apiClient.delete(`/api/assets/${assetId}`);
  return res?.data;
};

export const assignAsset = async (assetId, { employeeCode }) => {
  const res = await apiClient.post(`/api/assets/${assetId}/assign`, {
    employee_code: employeeCode,
  });
  return res?.data;
};

export const returnAsset = async (assetId, { returnNotes } = {}) => {
  const res = await apiClient.post(`/api/assets/${assetId}/return`, {
    notes: returnNotes,
  });
  return res?.data;
};

export const uploadAssetImages = async (assetId, files = []) => {
  const {
    data: { session },
  } = await import("@/services/api").then((m) => m.supabase.auth.getSession());
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:3004"}/api/assets/${assetId}/images`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
      // KHÔNG set Content-Type — browser tự set multipart boundary
      body: formData,
    },
  );
  if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
  return response.json();
};
