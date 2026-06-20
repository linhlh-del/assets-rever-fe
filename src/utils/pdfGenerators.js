import QRCode from 'qrcode'

/**
 * Generate PDF phiếu bàn giao
 * Sử dụng jsPDF để tạo document
 */
export const generateAssetTransferSlip = async (slipData) => {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  
  // Set font
  doc.setFontSize(14)
  doc.setFont('Courier')
  
  // Header
  doc.text('PHIẾU BÀN GIAO TÀI SẢN', 105, 15, { align: 'center' })
  
  // Slip info
  doc.setFontSize(11)
  doc.text(`Số phiếu: ${slipData.slipNumber}`, 20, 30)
  doc.text(`Ngày: ${new Date(slipData.transferredDate).toLocaleDateString('vi-VN')}`, 20, 38)
  
  // From section
  doc.setFontSize(12)
  doc.text('Người bàn giao:', 20, 50)
  doc.setFontSize(10)
  doc.text(`Mã NV: ${slipData.fromUserCode}`, 20, 57)
  doc.text(`Họ tên: ${slipData.fromUserName}`, 20, 64)
  doc.text(`Bộ phận: ${slipData.fromDepartment}`, 20, 71)
  
  // To section
  doc.setFontSize(12)
  doc.text('Người nhận:', 120, 50)
  doc.setFontSize(10)
  doc.text(`Mã NV: ${slipData.toUserCode}`, 120, 57)
  doc.text(`Họ tên: ${slipData.toUserName}`, 120, 64)
  doc.text(`Bộ phận: ${slipData.toDepartment}`, 120, 71)
  
  // Asset info
  doc.setFontSize(12)
  doc.text('Thông tin tài sản:', 20, 85)
  doc.setFontSize(10)
  doc.text(`Mã: ${slipData.assetCode}`, 20, 92)
  doc.text(`Tên: ${slipData.assetName}`, 20, 99)
  doc.text(`Serial: ${slipData.serialNumber}`, 20, 106)
  doc.text(`Loại: ${slipData.category}`, 20, 113)
  
  // Condition section
  doc.setFontSize(12)
  doc.text('Tình trạng:', 20, 127)
  doc.setFontSize(10)
  doc.text(`☐ Tốt    ☐ Bình thường    ☐ Hỏng hóc`, 20, 134)
  doc.text(`Ghi chú: ${slipData.notes || '...'}`, 20, 145)
  
  // Signatures
  doc.setFontSize(11)
  doc.text('Ký xác nhận', 20, 165)
  doc.text('Ký xác nhận', 120, 165)
  doc.text('Người bàn giao', 20, 190)
  doc.text('Người nhận', 120, 190)
  
  // QR code
  try {
    const qrCanvas = await QRCode.toCanvas(slipData.slipNumber)
    const qrImage = qrCanvas.toDataURL('image/png')
    doc.addImage(qrImage, 'PNG', 165, 145, 30, 30)
  } catch (err) {
    console.error('Error generating QR code:', err)
  }
  
  return doc
}

/**
 * Generate PDF for asset disposal report
 */
export const generateDisposalReport = async (assets) => {
  const { jsPDF } = await import('jspdf')
  await import('jspdf-autotable')
  
  const doc = new jsPDF()
  
  doc.setFontSize(16)
  doc.text('BÁO CÁO THANH LÝ TÀI SẢN', 105, 15, { align: 'center' })
  
  const tableData = assets.map(asset => [
    asset.asset_code,
    asset.product_name,
    parseFloat(asset.purchase_price || 0).toLocaleString('vi-VN'),
    new Date(asset.disposal_date).toLocaleDateString('vi-VN'),
    asset.disposal_reason,
  ])
  
  doc.autoTable({
    head: [['Mã', 'Tên', 'Giá mua', 'Ngày thanh lý', 'Lý do']],
    body: tableData,
    startY: 25,
  })
  
  return doc
}

/**
 * Generate maintenance completion certificate
 */
export const generateMaintenanceCertificate = async (ticket) => {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  
  doc.setFontSize(14)
  doc.text('GIẤY XÁC NHẬN BẢO TRÌ', 105, 15, { align: 'center' })
  
  doc.setFontSize(11)
  doc.text(`ID phiếu: ${ticket.id}`, 20, 30)
  doc.text(`Tài sản: ${ticket.product_name || ticket.assets?.product_name || ''}`, 20, 38)
  doc.text(`Serial: ${ticket.serial_number || ticket.assets?.serial_number || ''}`, 20, 46)
  doc.text(`Vấn đề: ${ticket.issue_description}`, 20, 54)
  doc.text(`Ngày báo cáo: ${new Date(ticket.created_at).toLocaleDateString('vi-VN')}`, 20, 62)
  
  if (ticket.status === 'completed' || ticket.status === 'closed') {
    doc.text(`Ngày hoàn tất: ${new Date(ticket.resolved_at).toLocaleDateString('vi-VN')}`, 20, 70)
    doc.text(`Ghi chú: ${ticket.solution || ticket.resolution_notes || ''}`, 20, 78)
  }
  
  return doc
}
