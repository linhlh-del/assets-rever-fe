import { supabase } from '@/services/api'

// Report maintenance issue
export const reportMaintenanceIssue = async (maintenanceData) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .insert([{
      asset_code: maintenanceData.assetCode,
      reported_by_employee_code: maintenanceData.reportedBy,
      issue_description: maintenanceData.description,
      issue_photo_url: maintenanceData.photoUrl,
      status: 'open',
      priority: maintenanceData.priority || 'normal',
      created_at: new Date().toISOString(),
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get maintenance tickets
export const getMaintenanceTickets = async ({
  status = null,
  priority = null,
  assetCode = null,
  page = 1,
  limit = 20,
} = {}) => {
  let query = supabase
    .from('maintenance_tickets')
    .select(`
      *,
      assets(asset_code, product_name),
      users(full_name)
    `, { count: 'exact' })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (priority) {
    query = query.eq('priority', priority)
  }
  
  if (assetCode) {
    query = query.eq('asset_code', assetCode)
  }

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
  }
}

// Get single ticket
export const getMaintenanceTicket = async (ticketId) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .select(`
      *,
      assets(asset_code, product_name, serial_number),
      users(full_name, employee_code)
    `)
    .eq('id', ticketId)
    .single()
  
  if (error) throw error
  return data
}

// Update maintenance ticket
export const updateMaintenanceTicket = async (ticketId, updateData) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Close maintenance ticket
export const closeMaintenanceTicket = async (ticketId, closeData) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .update({
      status: 'closed',
      resolved_at: new Date().toISOString(),
      resolution_notes: closeData.notes,
    })
    .eq('id', ticketId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get maintenance summary
export const getMaintenanceSummary = async () => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .select('status, priority', { count: 'exact' })
  
  if (error) throw error
  
  return {
    open: data.filter(t => t.status === 'open').length,
    inProgress: data.filter(t => t.status === 'in_progress').length,
    closed: data.filter(t => t.status === 'closed').length,
    highPriority: data.filter(t => t.priority === 'high').length,
  }
}
