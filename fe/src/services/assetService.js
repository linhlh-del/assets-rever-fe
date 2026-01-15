import { supabase } from '@/services/api'

// Get all assets with filters
export const getAssets = async ({
  search = '',
  category = null,
  status = null,
  department = null,
  assignedUser = null,
  page = 1,
  limit = 20,
} = {}) => {
  let query = supabase
    .from('assets')
    .select(`
      *,
      asset_images(image_url),
      asset_history(user_employee_code, from_date, to_date)
    `, { count: 'exact' })
  
  if (search) {
    query = query.or(
      `asset_code.ilike.%${search}%,product_name.ilike.%${search}%,serial_number.ilike.%${search}%`
    )
  }
  
  if (category) {
    query = query.eq('category', category)
  }
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (department) {
    query = query.eq('current_department', department)
  }
  
  if (assignedUser) {
    query = query.eq('current_user_employee_code', assignedUser)
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

// Get single asset
export const getAsset = async (assetCode) => {
  const { data, error } = await supabase
    .from('assets')
    .select(`
      *,
      asset_images(image_url),
      asset_history(
        user_employee_code,
        from_date,
        to_date,
        department,
        users(full_name)
      )
    `)
    .eq('asset_code', assetCode)
    .single()
  
  if (error) throw error
  return data
}

// Create asset
export const createAsset = async (assetData) => {
  const { data, error } = await supabase
    .from('assets')
    .insert([assetData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update asset
export const updateAsset = async (assetCode, assetData) => {
  const { data, error } = await supabase
    .from('assets')
    .update(assetData)
    .eq('asset_code', assetCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Assign asset to user
export const assignAsset = async (assetCode, assignmentData) => {
  // Create history record
  const { error: historyError } = await supabase
    .from('asset_history')
    .insert([{
      asset_code: assetCode,
      user_employee_code: assignmentData.userEmployeeCode,
      from_date: new Date().toISOString(),
      department: assignmentData.department,
    }])
  
  if (historyError) throw historyError
  
  // Update asset current assignment
  const { data, error } = await supabase
    .from('assets')
    .update({
      current_user_employee_code: assignmentData.userEmployeeCode,
      current_department: assignmentData.department,
      status: 'in_use',
      assigned_date: new Date().toISOString(),
    })
    .eq('asset_code', assetCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Return asset (mark as available)
export const returnAsset = async (assetCode, returnData) => {
  // Update history - close current record
  const { error: historyError } = await supabase
    .from('asset_history')
    .update({ to_date: new Date().toISOString() })
    .eq('asset_code', assetCode)
    .is('to_date', null)
  
  if (historyError) throw historyError
  
  // Update asset
  const { data, error } = await supabase
    .from('assets')
    .update({
      current_user_employee_code: null,
      current_department: returnData.department || null,
      status: 'available',
    })
    .eq('asset_code', assetCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Report maintenance
export const reportMaintenance = async (assetCode, maintenanceData) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .insert([{
      asset_code: assetCode,
      reported_by_employee_code: maintenanceData.reportedBy,
      issue_description: maintenanceData.description,
      status: 'open',
      created_at: new Date().toISOString(),
    }])
    .select()
    .single()
  
  if (error) throw error
  
  // Update asset status
  await supabase
    .from('assets')
    .update({ status: 'maintenance' })
    .eq('asset_code', assetCode)
  
  return data
}

// Dispose asset
export const disposeAsset = async (assetCode, disposalData) => {
  const { data, error } = await supabase
    .from('assets')
    .update({
      status: 'disposed',
      disposal_date: new Date().toISOString(),
      disposal_reason: disposalData.reason,
      current_user_employee_code: null,
    })
    .eq('asset_code', assetCode)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Upload asset images
export const uploadAssetImages = async (assetCode, files) => {
  const uploadedImages = []
  
  for (const file of files) {
    const fileName = `${assetCode}/${Date.now()}-${file.name}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('asset-images')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    const { data } = supabase
      .storage
      .from('asset-images')
      .getPublicUrl(fileName)
    
    const { error: dbError } = await supabase
      .from('asset_images')
      .insert([{
        asset_code: assetCode,
        image_url: data.publicUrl,
      }])
    
    if (dbError) throw dbError
    
    uploadedImages.push(data.publicUrl)
  }
  
  return uploadedImages
}

// Get asset audit history
export const getAssetAuditTrail = async (assetCode) => {
  const { data, error } = await supabase
    .from('asset_history')
    .select(`
      *,
      users(full_name, employee_code)
    `)
    .eq('asset_code', assetCode)
    .order('from_date', { ascending: false })
  
  if (error) throw error
  return data || []
}
