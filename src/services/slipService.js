// src/services/slipService.js
// UPDATED: Thêm file upload (Module 1) + send-email (Module 2)
// FIXED (giữ nguyên từ trước):
//   SLIP-04: approveAssignmentSlip nhận slipId (UUID)
//   SLIP-08: getAssignmentSlips thêm search và slip_type params
//   SLIP-11: createAssignmentSlip strict interface
import { apiClient, supabase } from "@/services/api";

// ─── GET slips ────────────────────────────────────────────────────────────────
export const getAssignmentSlips = async ({
  status = null,
  slip_type = null,
  search = null,
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.set("status", status);
  if (slip_type) params.set("slip_type", slip_type);
  if (search?.trim()) params.set("search", search.trim());

  const res = await apiClient.get(`/api/handover?${params}`);
  return {
    data: res?.data?.slips || [],
    total: res?.data?.pagination?.total || 0,
    page,
    limit,
  };
};

// ─── GET single slip ──────────────────────────────────────────────────────────
export const getAssignmentSlip = async (slipId) => {
  const res = await apiClient.get(`/api/handover/${slipId}`);
  return res?.data?.slip || null;
};

// ─── CREATE handover slip ─────────────────────────────────────────────────────
export const createAssignmentSlip = async ({
  to_employee_code,
  asset_ids,
  notes,
}) => {
  if (!to_employee_code) {
    throw new Error("to_employee_code là bắt buộc");
  }
  if (!asset_ids || asset_ids.length === 0) {
    throw new Error("asset_ids là bắt buộc và phải có ít nhất 1 UUID");
  }

  const res = await apiClient.post("/api/handover", {
    to_employee_code,
    asset_ids,
    notes: notes || null,
  });
  return res?.data?.slip;
};

// ─── CREATE return slip ───────────────────────────────────────────────────────
export const createReturnSlip = async ({ asset_ids, notes }) => {
  if (!asset_ids || asset_ids.length === 0) {
    throw new Error("asset_ids là bắt buộc và phải có ít nhất 1 UUID");
  }
  const res = await apiClient.post("/api/handover/return", {
    asset_ids,
    notes: notes || null,
  });
  return res?.data?.slip;
};

// ─── APPROVE / SIGN slip ──────────────────────────────────────────────────────
export const approveAssignmentSlip = async (slipId) => {
  const res = await apiClient.patch(`/api/handover/${slipId}/status`, {
    status: "signed",
  });
  return res?.data?.slip;
};

// ─── CONFIRM RECEIPT ──────────────────────────────────────────────────────────
export const confirmSlipReceipt = async (slipId, confirmData = {}) => {
  const res = await apiClient.patch(`/api/handover/${slipId}/status`, {
    status: "signed",
    notes: confirmData.notes || null,
  });
  return res?.data?.slip;
};

// ════════════════════════════════════════════════════════════════════════════════
// MODULE 1: File Upload / Download Template
// ════════════════════════════════════════════════════════════════════════════════

// ─── GET files của 1 slip ─────────────────────────────────────────────────────
export const getSlipFiles = async (slipId) => {
  const res = await apiClient.get(`/api/handover/${slipId}/files`);
  return {
    files: res?.data?.files || [],
  };
};

// ─── UPLOAD file vào slip ─────────────────────────────────────────────────────
// Dùng fetch trực tiếp (multipart/form-data) — không dùng apiClient.post
// vì apiClient set Content-Type: application/json (sẽ break multipart)
export const uploadSlipFile = async (
  slipId,
  file,
  file_kind = "signed_slip",
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_kind", file_kind);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:3004"}/api/handover/${slipId}/files`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        // KHÔNG set Content-Type — browser tự set multipart boundary
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${response.status}`);
  }

  return response.json();
};

// ─── DELETE file của 1 slip ───────────────────────────────────────────────────
export const deleteSlipFile = async (slipId, fileId) => {
  const res = await apiClient.delete(`/api/handover/${slipId}/files/${fileId}`);
  return res?.data;
};

// ─── DOWNLOAD template (file mẫu) ────────────────────────────────────────────
// BE trả { success, data: { url: signedUrl } }
export const downloadTemplate = async () => {
  const res = await apiClient.get("/api/handover/template");
  return res?.data || null;
};

// ════════════════════════════════════════════════════════════════════════════════
// MODULE 2: Send Email
// ════════════════════════════════════════════════════════════════════════════════

// ─── SEND email cho nhân viên nhận ───────────────────────────────────────────
// BE POST /api/handover/:id/send-email — đã implement ở BE
// Response: { success, message, data: { sent_to: email } }
export const sendSlipEmail = async (slipId) => {
  const res = await apiClient.post(`/api/handover/${slipId}/send-email`, {});
  return res?.data || null;
};
