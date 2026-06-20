import { ROLES } from "./constants";

// ─── Quyền quản lý User ───────────────────────────────────────────────────────
export const canCreateUser = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canEditUser = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canDeleteUser = (role) => {
  return role === ROLES.SUPER_ADMIN;
};

// ─── Quyền quản lý Asset ─────────────────────────────────────────────────────
export const canCreateAsset = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canEditAsset = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canAssignAsset = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canDisposeAsset = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canDeleteAsset = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canViewAssetPrice = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN, ROLES.MANAGER].includes(role);
};

// ─── Quyền quản lý Invoice ───────────────────────────────────────────────────
export const canManageInvoice = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN, ROLES.MANAGER].includes(role);
};

export const canCreateInvoice = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN, ROLES.MANAGER].includes(role);
};

// ─── Quyền quản lý Maintenance ───────────────────────────────────────────────
export const canCreateMaintenance = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canUpdateMaintenance = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};

export const canReportMaintenance = () => {
  return true; // Tất cả user đều có thể báo cáo sự cố
};

// ─── Quyền Report & Slip ─────────────────────────────────────────────────────
export const canGenerateReport = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN, ROLES.MANAGER].includes(role);
};

export const canCreateSlip = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN].includes(role);
};
