import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "@/services/userService";
import { toast } from "sonner";

export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (employeeCode) => {
  return useQuery({
    queryKey: ["users", employeeCode],
    queryFn: () => userService.getUser(employeeCode),
    enabled: !!employeeCode,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserAssetHistory = (employeeCode) => {
  return useQuery({
    queryKey: ["users", employeeCode, "assetHistory"],
    queryFn: () => userService.getUserAssetHistory(employeeCode),
    enabled: !!employeeCode,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Thêm người dùng thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeCode, data }) =>
      userService.updateUser(employeeCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.employeeCode],
      });
      toast.success("Cập nhật người dùng thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeCode) => userService.deleteUser(employeeCode),
    onSuccess: () => {
      console.log("🗑️ Delete success — invalidating users query"); // thêm dòng này
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Xóa người dùng thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeIds, data }) =>
      userService.bulkUpdateUsers(employeeIds, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Cập nhật hàng loạt thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
};
