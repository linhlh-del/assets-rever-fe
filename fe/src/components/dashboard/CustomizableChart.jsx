import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/utils/cn'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316']

const ChartTypeSelector = ({ type, onChange, disabled = false }) => {
  return (
    <div className="flex gap-2 mb-4">
      {['bar', 'pie', 'line'].map((chartType) => (
        <button
          key={chartType}
          onClick={() => onChange(chartType)}
          disabled={disabled}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors',
            type === chartType
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {chartType === 'bar' && 'Cột'}
          {chartType === 'pie' && 'Tròn'}
          {chartType === 'line' && 'Đường'}
        </button>
      ))}
    </div>
  )
}

const CustomizableChart = ({ 
  data = [], 
  title = 'Chart',
  type = 'bar',
  onTypeChange = () => {},
  dataKey = 'value',
  showTypeSelector = true,
  loading = false,
  height = 300
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-80 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          Không có dữ liệu
        </div>
      </div>
    )
  }

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: height,
      data: data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showTypeSelector && (
          <ChartTypeSelector type={type} onChange={onTypeChange} />
        )}
      </div>
      {renderChart()}
    </div>
  )
}

export default CustomizableChart
export { ChartTypeSelector }
