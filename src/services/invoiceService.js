import { apiClient, supabase } from '@/services/api'

// Get invoices with filters and pagination
export const getInvoices = async ({
  search = '',
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (search?.trim()) params.set('search', search.trim())

  const res = await apiClient.get(`/api/invoices?${params}`)
  return {
    data: res?.data?.invoices || [],
    total: res?.data?.pagination?.total || 0,
    page,
    limit,
  }
}

// Get single invoice by invoice_number
export const getInvoice = async (invoiceNumber) => {
  const res = await apiClient.get(`/api/invoices/${invoiceNumber}`)
  return res?.data?.invoice || null
}

// Create invoice
export const createInvoice = async (invoiceData) => {
  const res = await apiClient.post('/api/invoices', invoiceData)
  return res?.data?.invoice
}

// Update invoice
export const updateInvoice = async (invoiceNumber, invoiceData) => {
  const res = await apiClient.put(`/api/invoices/${invoiceNumber}`, invoiceData)
  return res?.data?.invoice
}

// Delete invoice
export const deleteInvoice = async (invoiceNumber) => {
  const res = await apiClient.delete(`/api/invoices/${invoiceNumber}`)
  return res?.data
}

// Upload invoice file — vẫn dùng Supabase Storage (đúng)
export const uploadInvoiceFile = async (file, invoiceNumber) => {
  const fileName = `invoices/${invoiceNumber}/${Date.now()}-${file.name}`

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

// Get invoice summary (computed from list)
export const getInvoiceSummary = async () => {
  const { data } = await getInvoices({ limit: 1000 })
  return {
    totalAmount: data.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0),
    totalCount: data.length,
  }
}
