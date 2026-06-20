import { useMemo } from "react";
import { useAuth } from "./useAuth";
import * as permissions from "@/utils/permissions";

export const usePermission = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role || "user";

  return useMemo(
    () => ({
      canCreateUser: permissions.canCreateUser(role),
      canEditUser: permissions.canEditUser(role),
      canDeleteUser: permissions.canDeleteUser(role),
      canCreateAsset: permissions.canCreateAsset(role),
      canEditAsset: permissions.canEditAsset(role),
      canAssignAsset: permissions.canAssignAsset(role),
      canDisposeAsset: permissions.canDisposeAsset(role),
      canDeleteAsset: permissions.canDeleteAsset(role),
      canViewAssetPrice: permissions.canViewAssetPrice(role),
      canManageInvoice: permissions.canManageInvoice(role),
      canCreateSlip: permissions.canCreateSlip(role),
      canCreateMaintenance: permissions.canCreateMaintenance(role),
      canUpdateMaintenance: permissions.canUpdateMaintenance(role),
      canReportMaintenance: permissions.canReportMaintenance(),
      canGenerateReport: permissions.canGenerateReport(role),
      canCreateInvoice: permissions.canCreateInvoice(role),
      role,
    }),
    [role]
  );
};

// Alias for backward compatibility
export const useCanCreateAsset = () => {
  const { canCreateAsset } = usePermission();
  return canCreateAsset;
};
