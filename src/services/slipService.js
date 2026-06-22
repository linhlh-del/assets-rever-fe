// FIXED:
//   SLIP-04: approveAssignmentSlip nhận slipId (UUID), không phải slip_number
//   SLIP-08: getAssignmentSlips thêm search và slip_type params để khớp với SlipFilters
//   SLIP-11: createAssignmentSlip strict interface, bỏ fallback nguy hiểm dễ gửi asset_code thay UUID
import { apiClient } from "@/services/api";

// ─── GET slips ────────────────────────────────────────────────────────────────
// SLIP-08: Thêm search và slip_type params — khớp với SlipFilters.jsx
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
  // search: gửi lên nhưng BE hiện chưa xử lý — không gây lỗi, chỉ bị ignored
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
// SLIP-11: Strict interface — không dùng fallback nguy hiểm
//   Caller PHẢI truyền đúng: { to_employee_code, asset_ids: UUID[], notes? }
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
    asset_ids, // phải là array of UUID strings — BE validate bằng Joi uuid()
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
// SLIP-04: Nhận slipId (UUID), không phải slip_number string
//   BE endpoint: PATCH /api/handover/:id/status (nhận :id là UUID)
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
