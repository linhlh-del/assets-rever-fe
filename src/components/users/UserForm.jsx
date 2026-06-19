import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { ROLES, ROLE_LABELS } from "@/utils/constants";
import { useDepartments } from "@/hooks/useDepartments";

const userCreateSchema = z.object({
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .endsWith("@rever.vn", "Email phải sử dụng domain @rever.vn"),
  employee_code: z.string().min(1, "Mã nhân viên không được để trống"),
  phone: z.string().optional().nullable(),
  department_id: z.string().uuid("Vui lòng chọn bộ phận").optional().nullable(),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  status: z.string().default("active"),
});

const userUpdateSchema = z.object({
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional().nullable(),
  department_id: z.string().uuid("Vui lòng chọn bộ phận").optional().nullable(),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  status: z.string().default("active"),
});

export function UserForm({ initialData, onSubmit, isLoading }) {
  const isEditing = !!initialData;
  const schema = isEditing ? userUpdateSchema : userCreateSchema;

  const { departments = [], isLoading: deptLoading } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? {
          full_name: initialData.full_name || "",
          phone: initialData.phone || "",
          department_id: initialData.department_id || "",
          role: initialData.role || "user",
          status: initialData.status || "active",
        }
      : {
          full_name: "",
          email: "",
          employee_code: "",
          phone: "",
          department_id: "",
          role: "user",
          status: "active",
        },
  });

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

      {/* Email — chỉ hiển thị khi tạo mới */}
      {!isEditing && (
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
      )}

      {/* Email display only khi edit */}
      {isEditing && (
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            value={initialData.email}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Không thể thay đổi email
          </p>
        </div>
      )}

      {/* Employee Code */}
      {!isEditing ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            Mã nhân viên *
          </label>
          <Input
            {...register("employee_code")}
            placeholder="RV00000001"
            error={errors.employee_code?.message}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Mã nhân viên</label>
          <Input
            value={initialData.employee_code}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Không thể thay đổi mã nhân viên
          </p>
        </div>
      )}

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

      {/* Department — UUID từ VPS */}
      <div>
        <label className="block text-sm font-medium mb-1">Bộ phận</label>
        <Select
          {...register("department_id")}
          error={errors.department_id?.message}
          disabled={isLoading || deptLoading}
        >
          <option value="">-- Chọn bộ phận --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.parent_name
                ? `${dept.parent_name} › ${dept.name}`
                : dept.name}
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
          {Object.entries(ROLES).map(([key, value]) => (
            <option key={key} value={value}>
              {ROLE_LABELS[value]}
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
