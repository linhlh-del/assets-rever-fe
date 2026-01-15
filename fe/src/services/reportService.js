import { supabase } from '@/services/api'

// Generate asset list report
export const getAssetListReport = async (filters = {}) => {
  let query = supabase
    .from('assets')
    .select(`
      asset_code,
      product_name,
      serial_number,
      category,
      status,
      current_department,
      current_user_employee_code,
      purchase_date,
      purchase_price,
      warranty_end_date
    `)
  
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters.department) {
    query = query.eq('current_department', filters.department)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

// Generate asset depreciation report
export const getAssetDepreciationReport = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select(`
      asset_code,
      product_name,
      purchase_price,
      purchase_date,
      category
    `)
    .eq('status', 'in_use')
  
  if (error) throw error
  
  return (data || []).map(asset => {
    const purchaseDate = new Date(asset.purchase_date)
    const today = new Date()
    const yearsDiff = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365)
    const depreciationRate = {
      'computer': 0.25,
      'phone': 0.3,
      'furniture': 0.1,
      'other': 0.15,
    }[asset.category] || 0.15
    
    const currentValue = asset.purchase_price * Math.pow(1 - depreciationRate, yearsDiff)
    const totalDepreciation = asset.purchase_price - currentValue
    
    return {
      ...asset,
      currentValue: Math.max(0, currentValue),
      totalDepreciation,
      depreciationPercent: (totalDepreciation / asset.purchase_price * 100).toFixed(2),
    }
  })
}

// Generate asset maintenance report
export const getAssetMaintenanceReport = async () => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .select(`
      id,
      asset_code,
      status,
      priority,
      created_at,
      resolved_at,
      assets(product_name)
    `)
  
  if (error) throw error
  return data || []
}

// Generate asset disposal report
export const getAssetDisposalReport = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select(`
      asset_code,
      product_name,
      category,
      purchase_price,
      disposal_date,
      disposal_reason
    `)
    .eq('status', 'disposed')
  
  if (error) throw error
  return data || []
}

// Generate user asset allocation report
export const getUserAssetAllocationReport = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      employee_code,
      full_name,
      department,
      assets(asset_code, product_name, category)
    `)
  
  if (error) throw error
  return data || []
}

// Generate department asset report
export const getDepartmentAssetReport = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select(`
      current_department,
      category,
      status
    `)
  
  if (error) throw error
  
  const grouped = data.reduce((acc, asset) => {
    const dept = asset.current_department || 'unassigned'
    if (!acc[dept]) {
      acc[dept] = { total: 0, byCategory: {}, byStatus: {} }
    }
    acc[dept].total += 1
    acc[dept].byCategory[asset.category] = (acc[dept].byCategory[asset.category] || 0) + 1
    acc[dept].byStatus[asset.status] = (acc[dept].byStatus[asset.status] || 0) + 1
    return acc
  }, {})
  
  return grouped
}

// Generate invoice summary report
export const getInvoiceSummaryReport = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      invoice_number,
      vendor_name,
      total_amount,
      status,
      invoice_date
    `)
  
  if (error) throw error
  
  return {
    invoices: data || [],
    totalAmount: data.reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
    byStatus: data.reduce((acc, inv) => ({
      ...acc,
      [inv.status]: (acc[inv.status] || 0) + (inv.total_amount || 0),
    }), {}),
  }
}
