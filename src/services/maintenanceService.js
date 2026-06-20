import { apiClient } from '@/services/api'

// Report maintenance issue
export const reportMaintenanceIssue = async (maintenanceData) => {
  const res = await apiClient.post('/api/maintenance', {
    asset_id: maintenanceData.asset_id,
    issue_description: maintenanceData.issue_description || maintenanceData.description,
    priority: maintenanceData.priority || 'medium',
  })
  return res?.data?.ticket
}

// Get maintenance tickets with filters
export const getMaintenanceTickets = async ({
  status = null,
  priority = null,
  search = null,
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (status) params.set('status', status)
  if (priority) params.set('priority', priority)
  if (search?.trim()) params.set('search', search.trim())

  const res = await apiClient.get(`/api/maintenance?${params}`)
  // BE trả { success, data: { tickets } }
  return {
    data: res?.data?.tickets || [],
    total: res?.data?.tickets?.length || 0,
    page,
    limit,
  }
}

// Get single ticket
export const getMaintenanceTicket = async (ticketId) => {
  const res = await apiClient.get(`/api/maintenance/${ticketId}`)
  return res?.data?.ticket || null
}

// Update maintenance ticket
export const updateMaintenanceTicket = async (ticketId, updateData) => {
  const res = await apiClient.put(`/api/maintenance/${ticketId}`, updateData)
  return res?.data?.ticket
}

// Close maintenance ticket (change status to completed)
export const closeMaintenanceTicket = async (ticketId, closeData = {}) => {
  const res = await apiClient.patch(`/api/maintenance/${ticketId}/status`, {
    status: 'completed',
    solution: closeData.notes || closeData.solution || null,
  })
  return res?.data?.ticket
}

// Get maintenance summary (computed from list)
export const getMaintenanceSummary = async () => {
  const { data } = await getMaintenanceTickets({ limit: 1000 })
  return {
    pending: data.filter(t => t.status === 'pending').length,
    inProgress: data.filter(t => t.status === 'in_progress').length,
    completed: data.filter(t => t.status === 'completed').length,
    highPriority: data.filter(t => t.priority === 'high').length,
  }
}
