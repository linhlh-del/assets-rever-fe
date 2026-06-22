// SlipForm.jsx
// UPDATED:
//   Thêm props defaultAssetId, defaultEmployeeCode để pre-select khi mở từ Asset pages
//   BUG-01: Controller thay vì register() + watch() (giữ nguyên fix cũ)
//   SLIP-10: value = asset.id (UUID) (giữ nguyên)

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAssets } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";

const slipSchema = z.object({
  to_employee_code: z.string().min(1, "Vui lòng chọn người nhận"),
  asset_id: z.string().uuid("Vui lòng chọn tài sản"),
  notes: z.string().optional(),
});

// Props:
//   onSubmit          — (data) => void
//   isLoading         — boolean
//   defaultAssetId    — string | undefined  → pre-select tài sản (từ AssetDetail/AssetsPage)
//   defaultEmployeeCode — string | undefined → pre-select người nhận (nếu cần)
export function SlipForm({
  onSubmit,
  isLoading,
  defaultAssetId,
  defaultEmployeeCode,
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(slipSchema),
    defaultValues: {
      to_employee_code: defaultEmployeeCode || "",
      asset_id: defaultAssetId || "",
      notes: "",
    },
  });

  const { data: assetsData } = useAssets({ status: "available", limit: 200 });
  const { data: usersData } = useUsers({ status: "active", limit: 200 });

  const assets = assetsData?.assets || [];
  const users = usersData?.data || [];

  // Nếu defaultAssetId được truyền vào nhưng asset đó không nằm trong danh sách
  // "available" (vd: đã in_use), vẫn hiển thị để user thấy — không drop silently
  const assetInList = defaultAssetId
    ? assets.some((a) => a.id === defaultAssetId)
    : true;

  const handleFormSubmit = (data) => {
    onSubmit({
      to_employee_code: data.to_employee_code,
      asset_ids: [data.asset_id],
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
        <Controller
          name="to_employee_code"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <option value="">Chọn người nhận</option>
              {users.map((user) => (
                <option key={user.employee_code} value={user.employee_code}>
                  {user.employee_code} – {user.full_name}
                </option>
              ))}
            </Select>
          )}
        />
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
        <Controller
          name="asset_id"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <option value="">Chọn tài sản (đang có sẵn)</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.asset_code} – {asset.product_name}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.asset_id && (
          <p className="text-sm text-red-600 mt-1">{errors.asset_id.message}</p>
        )}
        {/* Cảnh báo nếu pre-selected asset không còn available */}
        {defaultAssetId && !assetInList && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Tài sản được chọn không ở trạng thái "Có sẵn" — vui lòng chọn tài
            sản khác.
          </p>
        )}
        {!defaultAssetId && (
          <p className="text-xs text-muted-foreground mt-1">
            Chỉ hiển thị tài sản có trạng thái "Có sẵn"
          </p>
        )}
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Tình trạng thiết bị, ghi chú bàn giao..."
              rows={3}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={isLoading}>
          Tạo phiếu & tiếp tục
        </Button>
      </div>
    </form>
  );
}
