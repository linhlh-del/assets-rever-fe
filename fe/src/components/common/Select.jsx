import { cn } from '@/utils/cn'

const Select = ({ 
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  className,
  required,
  disabled,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export { Select }
export default Select

