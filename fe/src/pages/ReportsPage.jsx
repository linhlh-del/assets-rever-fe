import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/common/Badge'
import { useReports } from '@/hooks/useReports'
import { exportToExcel } from '@/utils/exportUtils'
import { Download, FileText, BarChart3, Calendar, Users, Package, Wrench } from 'lucide-react'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const reports = [
    {
      id: 'asset-inventory',
      title: 'Danh sách tài sản',
      description: 'Danh sách đầy đủ tất cả tài sản với chi tiết trạng thái',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'asset-status',
      title: 'Tài sản theo trạng thái',
      description: 'Phân tích tài sản theo trạng thái (hoạt động, bảo trì, lỗi, thanh lý)',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'asset-value',
      title: 'Tổng giá trị tài sản',
      description: 'Tổng giá trị tài sản theo danh mục và phòng ban',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'maintenance-report',
      title: 'Báo cáo bảo trì',
      description: 'Thống kê phiếu bảo trì, thời gian giải quyết, tỷ lệ thành công',
      icon: <Wrench className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'user-assets',
      title: 'Tài sản theo người dùng',
      description: 'Danh sách tài sản được giao cho từng nhân viên',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'invoice-summary',
      title: 'Tổng hợp hóa đơn',
      description: 'Thống kê hóa đơn theo nhà cung cấp, tháng, trạng thái',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'depreciation',
      title: 'Khấu hao tài sản',
      description: 'Tính toán khấu hao tài sản và giá trị còn lại',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-cyan-100 text-cyan-600',
    },
  ]

  const handleExportReport = async (reportId) => {
    // Simulated export - in real app, fetch data from API
    const reportData = {
      'asset-inventory': [
        { code: 'AS-001', name: 'Laptop Dell', category: 'Computer', status: 'active' },
        { code: 'AS-002', name: 'Printer HP', category: 'Peripheral', status: 'active' },
      ],
      'maintenance-report': [
        { id: 'MT-001', asset: 'AS-001', status: 'closed', created: '2024-01-10', resolved: '2024-01-12' },
      ],
    }

    const data = reportData[reportId] || []
    exportToExcel(data, `report_${reportId}_${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo và phân tích"
        description="Xem các báo cáo về tài sản, bảo trì, hóa đơn, và phân tích kinh tế"
      />

      {/* Date Range Filter */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Từ ngày</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Đến ngày</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button variant="secondary" className="w-full">
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${report.color}`}>
                {report.icon}
              </div>
              <Badge variant="outline" size="sm">
                Sẵn sàng
              </Badge>
            </div>

            <h3 className="font-semibold mt-4 mb-1">{report.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>

            <Button
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation()
                handleExportReport(report.id)
              }}
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </Button>
          </Card>
        ))}
      </div>

      {/* Report Preview (simplified) */}
      {selectedReport && (
        <Card className="border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {reports.find(r => r.id === selectedReport)?.title}
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExportReport(selectedReport)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất dữ liệu
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {reports.find(r => r.id === selectedReport)?.description}
          </p>
        </Card>
      )}
    </div>
  )
}
