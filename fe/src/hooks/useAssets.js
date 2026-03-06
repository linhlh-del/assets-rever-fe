import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

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
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (category) queryParams.append("category", category);
      if (department) queryParams.append("department", department);
      if (status) queryParams.append("status", status);
      if (search?.trim()) queryParams.append("search", search.trim());
      queryParams.append("limit", String(limit));
      queryParams.append("page", String(page));

      const url = `${API_BASE_URL}/api/assets?${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API Error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── GET single asset ─────────────────────────────────────────────────────────
export function useAsset(assetCode) {
  return useQuery({
    queryKey: ["assets", assetCode],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/assets/${assetCode}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API Error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
    enabled: !!assetCode,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── GET asset audit trail ────────────────────────────────────────────────────
export function useAssetAuditTrail(assetCode) {
  return useQuery({
    queryKey: ["assets", assetCode, "audit-trail"],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/assets/${assetCode}/audit-trail`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API Error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
    enabled: !!assetCode,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
}

// ─── CREATE asset ─────────────────────────────────────────────────────────────
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAsset) => {
      const response = await fetch(`${API_BASE_URL}/api/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi tạo tài sản");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── UPDATE asset ─────────────────────────────────────────────────────────────
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, data }) => {
      const response = await fetch(`${API_BASE_URL}/api/assets/${assetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi cập nhật tài sản");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── DELETE asset ─────────────────────────────────────────────────────────────
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId) => {
      const response = await fetch(`${API_BASE_URL}/api/assets/${assetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi xóa tài sản");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── ASSIGN asset ─────────────────────────────────────────────────────────────
export function useAssignAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, employeeCode }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/assets/${assetId}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeCode }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi phân công tài sản");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── RETURN asset ─────────────────────────────────────────────────────────────
export function useReturnAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, returnNotes }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/assets/${assetId}/return`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnNotes }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi thu hồi tài sản");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

// ─── UPLOAD asset images ──────────────────────────────────────────────────────
export function useUploadAssetImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetCode, files }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await fetch(
        `${API_BASE_URL}/api/assets/${assetCode}/images`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi upload ảnh");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
