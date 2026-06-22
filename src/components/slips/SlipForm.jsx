// FIXED: SLIP-05 (schema Zod sai — asset_code thay vì asset_ids UUID[]):
//   - Đổi asset_code → asset_ids (array of UUIDs)
//   - Đổi assigned_to → to_employee_code
//   - Bỏ assigned_date (BE tự set CURRENT_DATE, không cần FE gửi)
//   SLIP-10 (asset dropdown value là asset_code thay vì asset.id):
//   - <option value={asset.id}> thay vì value={asset.asset_code}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAssets } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";

// SLIP-05: Schema đúng khớp với BE handoverSchema (Joi):
//   to_employee_code: required string
//   asset_ids: array of UUIDs, min 1
//   notes: optional
const slipSchema = z.object({
  to_employee_code: z.string().min(1, "Vui lòng chọn người nhận"),
  // SLIP-05: asset_ids là array UUID, không phải single asset_code string
  asset_id: z.string().uuid("Vui lòng chọn tài sản"),
  notes: z.string().optional(),
});

export function SlipForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(slipSchema),
    defaultValues: {
      to_employee_code: "",
      asset_id: "",
      notes: "",
    },
  });

  // Lấy assets có status available để bàn giao
  const { data: assetsData } = useAssets({ status: "available", limit: 200 });
  const { data: usersData } = useUsers({ status: "active", limit: 200 });

  const assets = assetsData?.assets || [];
  const users = usersData?.data || [];

  // Adapter: form submit → đúng format BE expect
  const handleFormSubmit = (data) => {
    // SLIP-05: BE expect { to_employee_code, asset_ids: UUID[], notes }
    // SLIP-10: asset_id từ form đã là UUID (nhờ fix dropdown bên dưới)
    onSubmit({
      to_employee_code: data.to_employee_code,
      asset_ids: [data.asset_id], // wrap thành array — BE expect array
      notes: data.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Người nhận */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Người nhận <span className="text-red-500">*</span>
        </label>
        {/* SLIP-05: field name đổi từ assigned_to → to_employee_code */}
        <Select
          {...register("to_employee_code")}
          value={watch("to_employee_code")}
        >
          <option value="">Chọn người nhận</option>
          {users.map((user) => (
            <option key={user.employee_code} value={user.employee_code}>
              {user.employee_code} – {user.full_name}
            </option>
          ))}
        </Select>
        {errors.to_employee_code && (
          <p className="text-sm text-red-600 mt-1">
            {errors.to_employee_code.message}
          </p>
        )}
      </div>

      {/* Tài sản */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tài sản <span className="text-red-500">*</span>
        </label>
        <Select {...register("asset_id")} value={watch("asset_id")}>
          <option value="">Chọn tài sản (đang có sẵn)</option>
          {assets.map((asset) => (
            // SLIP-10: value = asset.id (UUID) thay vì asset.asset_code
            <option key={asset.id} value={asset.id}>
              {asset.asset_code} – {asset.product_name}
            </option>
          ))}
        </Select>
        {errors.asset_id && (
          <p className="text-sm text-red-600 mt-1">{errors.asset_id.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Chỉ hiển thị tài sản có trạng thái "Có sẵn"
        </p>
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <Textarea
          {...register("notes")}
          placeholder="Tình trạng thiết bị, ghi chú bàn giao..."
          rows={3}
        />
      </div>

      {/* NOTE: Đã bỏ field assigned_date — BE tự set slip_date = CURRENT_DATE */}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={isLoading}>
          Tạo phiếu bàn giao
        </Button>
      </div>
    </form>
  );
}
