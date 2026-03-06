import { ROLES } from "./constants";

export const canCreateUser = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canEditUser = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canDeleteUser = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canCreateAsset = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canEditAsset = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canAssignAsset = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canDisposeAsset = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canViewAssetPrice = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT].includes(role);
};

export const canManageInvoice = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT].includes(role);
};

export const canUpdateMaintenance = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canCreateMaintenance = (role) => {
  return role === ROLES.ADMIN_IT;
};

export const canReportMaintenance = () => {
  return true; // All users can report
};

export const canGenerateReport = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT, ROLES.DEV].includes(role);
};
export const canCreateInvoice = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT].includes(role);
};
export const canCreateSlip = (role) => {
  return role === ROLES.ADMIN_IT;
};
