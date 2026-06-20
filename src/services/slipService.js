import { apiClient } from '@/services/api'

// Get handover/return slips (formerly "assignment_slips")
export const getAssignmentSlips = async ({
  status = null,
  slip_type = null,
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (status) params.set('status', status)
  if (slip_type) params.set('slip_type', slip_type)

  const res = await apiClient.get(`/api/handover?${params}`)
  return {
    data: res?.data?.slips || [],
    total: res?.data?.pagination?.total || 0,
    page,
    limit,
  }
}

// Get single slip
export const getAssignmentSlip = async (slipId) => {
  const res = await apiClient.get(`/api/handover/${slipId}`)
  return res?.data?.slip || null
}

// Create handover slip
export const createAssignmentSlip = async (slipData) => {
  const res = await apiClient.post('/api/handover', {
    to_employee_code: slipData.toUser || slipData.to_employee_code,
    asset_ids: slipData.asset_ids || (slipData.assetCode ? [slipData.assetCode] : []),
    notes: slipData.notes || null,
  })
  return res?.data?.slip
}

// Create return slip
export const createReturnSlip = async (slipData) => {
  const res = await apiClient.post('/api/handover/return', {
    asset_ids: slipData.asset_ids || [],
    notes: slipData.notes || null,
  })
  return res?.data?.slip
}

// Approve/sign slip (change status)
export const approveAssignmentSlip = async (slipId) => {
  const res = await apiClient.patch(`/api/handover/${slipId}/status`, {
    status: 'signed',
  })
  return res?.data?.slip
}

// Confirm receipt
export const confirmSlipReceipt = async (slipId, confirmData = {}) => {
  const res = await apiClient.patch(`/api/handover/${slipId}/status`, {
    status: 'received',
    notes: confirmData.notes || null,
  })
  return res?.data?.slip
}
