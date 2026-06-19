import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

export function useDepartments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await apiClient.get("/api/departments");
      return res.data.departments;
    },
    staleTime: 10 * 60 * 1000, // cache 10 phút — departments ít thay đổi
  });

  return {
    departments: data || [],
    isLoading,
    error,
  };
}
