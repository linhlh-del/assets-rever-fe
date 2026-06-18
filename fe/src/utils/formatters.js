import { format } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '-'
  return format(new Date(date), formatStr)
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatEmployeeCode = (code) => {
  if (!code) return '-'
  return code.toUpperCase()
}

export const formatPhone = (phone) => {
  if (!phone) return '-'
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}
