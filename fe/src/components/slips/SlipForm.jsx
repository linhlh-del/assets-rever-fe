import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAssets } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";

// Validation schema
const slipSchema = z.object({
  asset_code: z.string().min(1, "Vui lòng chọn tài sản"),
  assigned_to: z.string().min(1, "Vui lòng chọn người nhận"),
  assigned_date: z.string().min(1, "Vui lòng chọn ngày bàn giao"),
  notes: z.string().optional(),
});

export function SlipForm({ initialData, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(slipSchema),
    defaultValues: initialData || {
      asset_code: "",
      assigned_to: "",
      assigned_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  // Fetch assets and users for dropdowns
  const { data: assetsData } = useAssets({ status: "available", limit: 100 });
  const { data: usersData } = useUsers({ status: "active", limit: 100 });

  const assets = assetsData?.data || [];
  const users = usersData?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Asset Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Tài sản *</label>
        <Select {...register("asset_code")} value={watch("asset_code")}>
          <option value="">Chọn tài sản</option>
          {assets.map((asset) => (
            <option key={asset.asset_code} value={asset.asset_code}>
              {asset.asset_code} - {asset.product_name}
            </option>
          ))}
        </Select>
        {errors.asset_code && (
          <p className="text-sm text-red-600 mt-1">
            {errors.asset_code.message}
          </p>
        )}
      </div>

      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Người nhận *</label>
        <Select {...register("assigned_to")} value={watch("assigned_to")}>
          <option value="">Chọn người nhận</option>
          {users.map((user) => (
            <option key={user.employee_code} value={user.employee_code}>
              {user.employee_code} - {user.full_name}
            </option>
          ))}
        </Select>
        {errors.assigned_to && (
          <p className="text-sm text-red-600 mt-1">
            {errors.assigned_to.message}
          </p>
        )}
      </div>

      {/* Assignment Date */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ngày bàn giao *
        </label>
        <Input type="date" {...register("assigned_date")} />
        {errors.assigned_date && (
          <p className="text-sm text-red-600 mt-1">
            {errors.assigned_date.message}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <Textarea
          {...register("notes")}
          placeholder="Ghi chú thêm..."
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          Tạo phiếu bàn giao
        </Button>
      </div>
    </form>
  );
}
