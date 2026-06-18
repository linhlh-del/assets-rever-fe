import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { ROLES, DEPARTMENTS, ASSET_STATUS } from "@/utils/constants";

// Validation schema
const userSchema = z.object({
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .endsWith("@rever.vn", "Email phải sử dụng domain @rever.vn"),
  employee_code: z.string().min(1, "Mã nhân viên không được để trống"),
  phone: z.string().optional(),
  department: z.string().min(1, "Vui lòng chọn bộ phận"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  status: z.string().default("active"),
});

export function UserForm({ initialData, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      full_name: "",
      email: "",
      employee_code: "",
      phone: "",
      department: "",
      role: "user",
      status: "active",
    },
  });

  const employeeCode = watch("employee_code");
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Họ và tên *</label>
        <Input
          {...register("full_name")}
          placeholder="Nguyễn Văn A"
          error={errors.full_name?.message}
          disabled={isLoading}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <Input
          {...register("email")}
          type="email"
          placeholder="user@rever.vn"
          error={errors.email?.message}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Email phải sử dụng domain @rever.vn
        </p>
      </div>

      {/* Employee Code */}
      <div>
        <label className="block text-sm font-medium mb-1">Mã nhân viên *</label>
        <Input
          {...register("employee_code")}
          placeholder="EMP001"
          error={errors.employee_code?.message}
          disabled={isLoading || isEditing}
          className={isEditing ? "bg-muted cursor-not-allowed" : ""}
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground mt-1">
            Không thể thay đổi mã nhân viên
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Điện thoại</label>
        <Input
          {...register("phone")}
          placeholder="0901234567"
          error={errors.phone?.message}
          disabled={isLoading}
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium mb-1">Bộ phận *</label>
        <Select
          {...register("department")}
          error={errors.department?.message}
          disabled={isLoading}
        >
          <option value="">-- Chọn bộ phận --</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium mb-1">Vai trò *</label>
        <Select
          {...register("role")}
          error={errors.role?.message}
          disabled={isLoading}
        >
          <option value="">-- Chọn vai trò --</option>
          {Object.entries(ROLES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Trạng thái</label>
        <Select
          {...register("status")}
          error={errors.status?.message}
          disabled={isLoading}
        >
          <option value="active">Đang làm việc</option>
          <option value="inactive">Tạm dừng</option>
          <option value="resigned">Nghỉ việc</option>
        </Select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isLoading}
      >
        {isEditing ? "Cập nhật" : "Thêm mới"}
      </Button>
    </form>
  );
}
