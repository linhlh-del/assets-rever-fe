export const ROLES = {
  SUPER_ADMIN: "super_admin",
  IT_ADMIN: "it_admin",
  MANAGER: "manager",
  USER: "user",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.IT_ADMIN]: "IT Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.USER]: "Người dùng",
};

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  RESIGNED: "resigned",
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Đang làm việc",
  [USER_STATUS.INACTIVE]: "Tạm nghỉ",
  [USER_STATUS.RESIGNED]: "Đã nghỉ việc",
};

export const ASSET_STATUS = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
  BROKEN: "broken",
  DISPOSED: "disposed",
};

export const ASSET_STATUS_LABELS = {
  [ASSET_STATUS.AVAILABLE]: "Có sẵn",
  [ASSET_STATUS.IN_USE]: "Đang sử dụng",
  [ASSET_STATUS.MAINTENANCE]: "Đang bảo trì",
  [ASSET_STATUS.BROKEN]: "Hư hỏng",
  [ASSET_STATUS.DISPOSED]: "Đã thanh lý",
};

export const ASSET_STATUS_COLORS = {
  [ASSET_STATUS.AVAILABLE]: "bg-green-100 text-green-800",
  [ASSET_STATUS.IN_USE]: "bg-blue-100 text-blue-800",
  [ASSET_STATUS.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
  [ASSET_STATUS.BROKEN]: "bg-red-100 text-red-800",
  [ASSET_STATUS.DISPOSED]: "bg-gray-100 text-gray-800",
};

// 13 categories khớp CHECK constraint VPS (dùng chung 1 nguồn duy nhất)
export const ASSET_CATEGORIES = [
  { value: "Laptop", label: "Laptop" },
  { value: "Desktop", label: "Desktop" },
  { value: "Monitor", label: "Màn hình" },
  { value: "Keyboard", label: "Bàn phím" },
  { value: "Mouse", label: "Chuột" },
  { value: "Headset", label: "Tai nghe" },
  { value: "Webcam", label: "Webcam" },
  { value: "Printer", label: "Máy in" },
  { value: "Scanner", label: "Máy quét" },
  { value: "Projector", label: "Máy chiếu" },
  { value: "Phone", label: "Điện thoại" },
  { value: "Tablet", label: "Máy tính bảng" },
  { value: "Other", label: "Khác" },
];

// DEPARTMENTS không còn dùng hardcode — lấy từ API /api/departments
// Giữ lại làm fallback khi API chưa load xong
export const DEPARTMENTS_FALLBACK = [];

export const MAINTENANCE_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANNOT_FIX: "cannot_fix",
};

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.PENDING]: "Chờ xử lý",
  [MAINTENANCE_STATUS.IN_PROGRESS]: "Đang sửa",
  [MAINTENANCE_STATUS.COMPLETED]: "Hoàn thành",
  [MAINTENANCE_STATUS.CANNOT_FIX]: "Không sửa được",
};

export const FILE_TYPES = {
  PDF: "application/pdf",
  EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  WORD: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  IMAGE: "image/*",
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5;
