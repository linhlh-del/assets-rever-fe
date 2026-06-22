// FIXED: SLIP-09 — useApproveAssignmentSlip dùng sai variable name
//   onSuccess(_, slipNumber) thực ra nhận slipId (UUID) → invalidate sai cache key
//   Đổi variable name thành slipId cho rõ ràng, invalidate đúng
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

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const useCreateAssignmentSlip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slipData) => slipService.createAssignmentSlip(slipData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      // Invalidate assets vì status đã đổi từ available → in_use
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
    // SLIP-04: mutationFn nhận slipId (UUID)
    mutationFn: (slipId) => slipService.approveAssignmentSlip(slipId),
    // SLIP-09: Đổi variable name từ slipNumber → slipId cho đúng ý nghĩa
    //   Trước: onSuccess(_, slipNumber) → invalidate ['slips', slipNumber] (sai key — là UUID)
    //   Sau:   onSuccess(_, slipId)     → invalidate ['slips', slipId] (đúng)
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
