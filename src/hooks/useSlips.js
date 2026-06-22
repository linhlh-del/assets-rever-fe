// src/hooks/useSlips.js
// UPDATED: Thêm hooks cho Module 1 (file upload) và Module 2 (send email)
// FIXED (giữ nguyên từ trước):
//   SLIP-09: useApproveAssignmentSlip dùng đúng variable name slipId
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as slipService from "@/services/slipService";
import { toast } from "sonner";

// ─── GET list ─────────────────────────────────────────────────────────────────
export const useAssignmentSlips = (filters = {}) => {
  return useQuery({
    queryKey: ["slips", filters],
    queryFn: () => slipService.getAssignmentSlips(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// ─── GET single ───────────────────────────────────────────────────────────────
export const useAssignmentSlip = (slipId) => {
  return useQuery({
    queryKey: ["slips", slipId],
    queryFn: () => slipService.getAssignmentSlip(slipId),
    enabled: !!slipId,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── CREATE handover ──────────────────────────────────────────────────────────
export const useCreateAssignmentSlip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slipData) => slipService.createAssignmentSlip(slipData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Tạo phiếu bàn giao thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

// ─── APPROVE / SIGN ───────────────────────────────────────────────────────────
export const useApproveAssignmentSlip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slipId) => slipService.approveAssignmentSlip(slipId),
    // SLIP-09: Đúng variable name slipId
    onSuccess: (_, slipId) => {
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      queryClient.invalidateQueries({ queryKey: ["slips", slipId] });
      toast.success("Ký phiếu bàn giao thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

// ─── CONFIRM RECEIPT ──────────────────────────────────────────────────────────
export const useConfirmSlipReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slipId, data }) =>
      slipService.confirmSlipReceipt(slipId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      queryClient.invalidateQueries({ queryKey: ["slips", variables.slipId] });
      toast.success("Xác nhận nhận phiếu thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

// ════════════════════════════════════════════════════════════════════════════════
// MODULE 1: File Upload / Download Template
// ════════════════════════════════════════════════════════════════════════════════

// ─── GET files của 1 slip ─────────────────────────────────────────────────────
// slipId có thể là null/undefined để tắt query (khi modal chưa mở)
export const useSlipFiles = (slipId) => {
  return useQuery({
    queryKey: ["slips", slipId, "files"],
    queryFn: () => slipService.getSlipFiles(slipId),
    enabled: !!slipId,
    staleTime: 2 * 60 * 1000, // 2 phút — files thay đổi thường hơn
  });
};

// ─── UPLOAD file ──────────────────────────────────────────────────────────────
export const useUploadSlipFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slipId, file, file_kind }) =>
      slipService.uploadSlipFile(slipId, file, file_kind),
    onSuccess: (_, variables) => {
      // Invalidate files query để refetch danh sách files
      queryClient.invalidateQueries({
        queryKey: ["slips", variables.slipId, "files"],
      });
      toast.success("Upload file thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi upload: ${error.message}`);
    },
  });
};

// ─── DELETE file ──────────────────────────────────────────────────────────────
export const useDeleteSlipFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slipId, fileId }) =>
      slipService.deleteSlipFile(slipId, fileId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["slips", variables.slipId, "files"],
      });
      toast.success("Đã xóa file");
    },
    onError: (error) => {
      toast.error(`Lỗi xóa file: ${error.message}`);
    },
  });
};

// ─── DOWNLOAD template ────────────────────────────────────────────────────────
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: () => slipService.downloadTemplate(),
    onError: (error) => {
      toast.error(`Không thể tải file mẫu: ${error.message}`);
    },
  });
};

// ════════════════════════════════════════════════════════════════════════════════
// MODULE 2: Send Email
// ════════════════════════════════════════════════════════════════════════════════

// ─── SEND EMAIL ───────────────────────────────────────────────────────────────
export const useSendSlipEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slipId) => slipService.sendSlipEmail(slipId),
    onSuccess: (data, slipId) => {
      // Invalidate slip list để cập nhật email_sent_at hiển thị trên SlipsList
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      queryClient.invalidateQueries({ queryKey: ["slips", slipId] });

      const sentTo = data?.sent_to;
      toast.success(
        sentTo ? `Email đã gửi đến ${sentTo}` : "Gửi email thành công",
      );
    },
    onError: (error) => {
      // Hiển thị lỗi cụ thể từ BE (VD: "Không tìm thấy email của nhân viên nhận")
      toast.error(`Lỗi gửi email: ${error.message}`);
    },
  });
};
