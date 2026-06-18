import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects
 * @param {string} fileName - File name without extension
 * @param {string} sheetName - Sheet name (default: 'Sheet1')
 */
export const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects
 * @param {string} fileName - File name without extension
 */
export const exportToCSV = (data, fileName) => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row =>
      Object.values(row)
        .map(val => {
          if (typeof val === 'string' && val.includes(',')) {
            return `"${val}"`
          }
          return val
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${fileName}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export table data to PDF
 * @param {Array} data - Array of objects
 * @param {Array} columns - Array of column definitions [{header, dataKey}, ...]
 * @param {string} fileName - File name without extension
 * @param {string} title - Document title
 */
export const exportToPDF = (data, columns, fileName, title) => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 22)
  
  // Format data for table
  const tableData = data.map(row =>
    columns.map(col => {
      const value = row[col.dataKey]
      if (value instanceof Date) {
        return value.toLocaleDateString('vi-VN')
      }
      if (typeof value === 'number') {
        return value.toLocaleString('vi-VN')
      }
      return value || ''
    })
  )
  
  // Add table
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 30,
    margin: { top: 30 },
    headStyles: {
      backgroundColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      backgroundColor: [245, 247, 250],
    },
    columnStyles: columns.reduce((acc, col, idx) => {
      acc[idx] = { halign: col.align || 'left' }
      return acc
    }, {}),
    didDrawPage: (data) => {
      // Footer
      const pageSize = doc.internal.pageSize
      const pageHeight = pageSize.getHeight()
      const pageWidth = pageSize.getWidth()
      doc.setFontSize(10)
      doc.text(
        `Trang ${data.pageNumber}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    },
  })
  
  doc.save(`${fileName}.pdf`)
}

/**
 * Export multiple sheets to Excel
 * @param {Array} sheets - Array of {name, data} objects
 * @param {string} fileName - File name without extension
 */
export const exportMultiSheetExcel = (sheets, fileName) => {
  const workbook = XLSX.utils.book_new()
  
  sheets.forEach(({ name, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, name)
  })
  
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

/**
 * Format currency for export
 */
export const formatCurrencyForExport = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

/**
 * Format date for export
 */
export const formatDateForExport = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
