import { supabase } from '@/services/api'

// Get all users with filters
export const getUsers = async ({
  search = '',
  department = null,
  role = null,
  status = null,
  page = 1,
  limit = 20,
} = {}) => {
  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
  
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`
    )
  }
  
  if (department) {
    query = query.eq('department', department)
  }
  
  if (role) {
    query = query.eq('role', role)
  }
  
  if (status) {
    query = query.eq('status', status)
  }

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)
  
  const { data, error, count } = await query
  
  if (error) throw error
  
  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
  }
}

// Get single user
export const getUser = async (employeeCode) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('employee_code', employeeCode)
    .single()
  
  if (error) throw error
  return data
}

// Create user
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update user
export const updateUser = async (employeeCode, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('employee_code', employeeCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete user (soft delete)
export const deleteUser = async (employeeCode) => {
  const { data, error } = await supabase
    .from('users')
    .update({ status: 'resigned' })
    .eq('employee_code', employeeCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get user asset history
export const getUserAssetHistory = async (employeeCode) => {
  const { data, error } = await supabase
    .from('asset_history')
    .select(`
      *,
      assets(asset_code, product_name, category)
    `)
    .eq('user_employee_code', employeeCode)
    .order('from_date', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Bulk update users
export const bulkUpdateUsers = async (employeeIds, updateData) => {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .in('employee_code', employeeIds)
    .select()
  
  if (error) throw error
  return data || []
}
