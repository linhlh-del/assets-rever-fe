import { supabase } from '@/services/api'

// Upload assignment slip
export const createAssignmentSlip = async (slipData) => {
  const { data, error } = await supabase
    .from('assignment_slips')
    .insert([{
      slip_number: slipData.slipNumber,
      asset_code: slipData.assetCode,
      from_user_employee_code: slipData.fromUser,
      to_user_employee_code: slipData.toUser,
      from_department: slipData.fromDepartment,
      to_department: slipData.toDepartment,
      transferred_date: new Date().toISOString(),
      notes: slipData.notes,
      status: 'pending',
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get assignment slips
export const getAssignmentSlips = async ({
  status = null,
  asset = null,
  page = 1,
  limit = 20,
} = {}) => {
  let query = supabase
    .from('assignment_slips')
    .select(`
      *,
      assets(asset_code, product_name)
    `, { count: 'exact' })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (asset) {
    query = query.eq('asset_code', asset)
  }

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)
  
  const { data, error, count } = await query
    .order('transferred_date', { ascending: false })
  
  if (error) throw error
  
  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
  }
}

// Get single slip
export const getAssignmentSlip = async (slipNumber) => {
  const { data, error } = await supabase
    .from('assignment_slips')
    .select(`
      *,
      assets(asset_code, product_name, serial_number)
    `)
    .eq('slip_number', slipNumber)
    .single()
  
  if (error) throw error
  return data
}

// Approve slip
export const approveAssignmentSlip = async (slipNumber) => {
  const { data, error } = await supabase
    .from('assignment_slips')
    .update({
      status: 'approved',
      approved_date: new Date().toISOString(),
    })
    .eq('slip_number', slipNumber)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Receive slip (recipient confirms)
export const confirmSlipReceipt = async (slipNumber, confirmData) => {
  const { data, error } = await supabase
    .from('assignment_slips')
    .update({
      status: 'received',
      received_date: new Date().toISOString(),
      received_by_notes: confirmData.notes,
    })
    .eq('slip_number', slipNumber)
    .select()
    .single()
  
  if (error) throw error
  return data
}
