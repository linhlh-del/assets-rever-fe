import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssets,
  getAsset,
  getAssetAuditTrail,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  returnAsset,
  uploadAssetImages,
} from "@/services/assetService";

// ─── GET assets ───────────────────────────────────────────────────────────────
export function useAssets(params = {}) {
  const {
    category = null,
    department = null,
    limit = 20,
    page = 1,
    search = "",
    status = null,
  } = params;

  return useQuery({
    queryKey: ["assets", { category, department, limit, page, search, status }],
    queryFn: () =>
      getAssets({ category, department, limit, page, search, status }),
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── GET single asset ─────────────────────────────────────────────────────────
export function useAsset(assetId) {
  return useQuery({
    queryKey: ["assets", assetId],
    queryFn: () => getAsset(assetId),
    enabled: !!assetId,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── GET asset audit trail ────────────────────────────────────────────────────
export function useAssetAuditTrail(assetId) {
  return useQuery({
    queryKey: ["assets", assetId, "audit-trail"],
    queryFn: () => getAssetAuditTrail(assetId),
    enabled: !!assetId,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── CREATE asset ─────────────────────────────────────────────────────────────
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAsset) => createAsset(newAsset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── UPDATE asset ─────────────────────────────────────────────────────────────
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, data }) => updateAsset(assetId, data),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      if (assetId) {
        queryClient.invalidateQueries({ queryKey: ["assets", assetId] });
      }
    },
  });
}

// ─── DELETE asset ─────────────────────────────────────────────────────────────
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── ASSIGN asset ─────────────────────────────────────────────────────────────
export function useAssignAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, employeeCode }) =>
      assignAsset(assetId, { employeeCode }),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      if (assetId) {
        queryClient.invalidateQueries({ queryKey: ["assets", assetId] });
      }
    },
  });
}

// ─── RETURN asset ─────────────────────────────────────────────────────────────
export function useReturnAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, returnNotes }) =>
      returnAsset(assetId, { returnNotes }),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      if (assetId) {
        queryClient.invalidateQueries({ queryKey: ["assets", assetId] });
      }
    },
  });
}

// ─── DISPOSE asset (update status to disposed) ────────────────────────────────
export function useDisposeAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, data }) => updateAsset(assetId, data),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      if (assetId) {
        queryClient.invalidateQueries({ queryKey: ["assets", assetId] });
      }
    },
  });
}

// ─── UPLOAD asset images ──────────────────────────────────────────────────────
export function useUploadAssetImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, files }) => uploadAssetImages(assetId, files),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      if (assetId) {
        queryClient.invalidateQueries({ queryKey: ["assets", assetId] });
      }
    },
  });
}
