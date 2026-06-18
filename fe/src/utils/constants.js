export const ROLES = {
  ADMIN_IT: 'admin_it',
  ACCOUNTANT: 'accountant',
  DEV: 'dev',
  USER: 'user',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN_IT]: 'Admin/IT',
  [ROLES.ACCOUNTANT]: 'Kế toán',
  [ROLES.DEV]: 'Developer',
  [ROLES.USER]: 'Người dùng',
}

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESIGNED: 'resigned',
}

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Đang làm việc',
  [USER_STATUS.INACTIVE]: 'Tạm nghỉ',
  [USER_STATUS.RESIGNED]: 'Đã nghỉ việc',
}

export const ASSET_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  BROKEN: 'broken',
  DISPOSED: 'disposed',
}

export const ASSET_STATUS_LABELS = {
  [ASSET_STATUS.AVAILABLE]: 'Có sẵn',
  [ASSET_STATUS.IN_USE]: 'Đang sử dụng',
  [ASSET_STATUS.MAINTENANCE]: 'Đang bảo trì',
  [ASSET_STATUS.BROKEN]: 'Hư hỏng',
  [ASSET_STATUS.DISPOSED]: 'Đã thanh lý',
}

export const ASSET_STATUS_COLORS = {
  [ASSET_STATUS.AVAILABLE]: 'bg-green-100 text-green-800',
  [ASSET_STATUS.IN_USE]: 'bg-blue-100 text-blue-800',
  [ASSET_STATUS.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [ASSET_STATUS.BROKEN]: 'bg-red-100 text-red-800',
  [ASSET_STATUS.DISPOSED]: 'bg-gray-100 text-gray-800',
}

export const ASSET_CATEGORIES = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Monitor', label: 'Màn hình' },
  { value: 'Keyboard', label: 'Bàn phím' },
  { value: 'Mouse', label: 'Chuột' },
  { value: 'Headset', label: 'Tai nghe' },
  { value: 'Webcam', label: 'Webcam' },
  { value: 'Other', label: 'Khác' },
]

export const DEPARTMENTS = [
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'General', label: 'General' },
]

export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANNOT_FIX: 'cannot_fix',
}

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.PENDING]: 'Chờ xử lý',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'Đang sửa',
  [MAINTENANCE_STATUS.COMPLETED]: 'Hoàn thành',
  [MAINTENANCE_STATUS.CANNOT_FIX]: 'Không sửa được',
}

export const FILE_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  IMAGE: 'image/*',
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_FILES = 5
