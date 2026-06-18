import { supabase } from '@/services/api'

// Upload invoice file
export const uploadInvoiceFile = async (file, invoiceNumber) => {
  const fileName = `${invoiceNumber}/${Date.now()}-${file.name}`
  
  const { error: uploadError } = await supabase
    .storage
    .from('invoices')
    .upload(fileName, file)
  
  if (uploadError) throw uploadError
  
  const { data } = supabase
    .storage
    .from('invoices')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

// Create invoice
export const createInvoice = async (invoiceData) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoiceData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get invoices with filters
export const getInvoices = async ({
  search = '',
  vendor = null,
  status = null,
  page = 1,
  limit = 20,
} = {}) => {
  let query = supabase
    .from('invoices')
    .select(`
      *,
      invoice_files(file_url, file_type)
    `, { count: 'exact' })
  
  if (search) {
    query = query.or(
      `invoice_number.ilike.%${search}%,vendor_name.ilike.%${search}%`
    )
  }
  
  if (vendor) {
    query = query.eq('vendor_name', vendor)
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

// Get single invoice
export const getInvoice = async (invoiceNumber) => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_files(file_url, file_type),
      assets(asset_code, product_name, quantity, unit_price)
    `)
    .eq('invoice_number', invoiceNumber)
    .single()
  
  if (error) throw error
  return data
}

// Update invoice
export const updateInvoice = async (invoiceNumber, invoiceData) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('invoice_number', invoiceNumber)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Confirm invoice
export const confirmInvoice = async (invoiceNumber) => {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'confirmed',
      confirmed_date: new Date().toISOString(),
    })
    .eq('invoice_number', invoiceNumber)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get invoice summary
export const getInvoiceSummary = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('total_amount, status', { count: 'exact' })
  
  if (error) throw error
  
  return {
    totalAmount: data.reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
    totalCount: data.length,
    byStatus: data.reduce((acc, inv) => ({
      ...acc,
      [inv.status]: (acc[inv.status] || 0) + 1,
    }), {}),
  }
}
