// components/assets/AssetForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { ASSET_CATEGORIES } from "@/utils/constants";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Dùng enum từ constants để đảm bảo khớp CHECK constraint VPS
const CATEGORY_VALUES = ASSET_CATEGORIES.map((c) => c.value);

const assetSchema = z.object({
  asset_code: z.string().min(1, "Mã tài sản không được để trống"),
  product_name: z.string().min(1, "Tên sản phẩm không được để trống"),
  category: z
    .string()
    .min(1, "Vui lòng chọn loại")
    .refine((v) => CATEGORY_VALUES.includes(v), {
      message: "Loại tài sản không hợp lệ",
    }),
  serial_number: z.string().optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  purchase_price: z.coerce
    .number()
    .positive("Giá phải lớn hơn 0")
    .optional()
    .nullable()
    .or(z.literal("")),
  warranty_expiry_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// ─── Component ────────────────────────────────────────────────────────────────
export function AssetForm({ initialData, onSubmit, isLoading, isEditing }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          warranty_expiry_date: initialData.warranty_expiry_date
            ? initialData.warranty_expiry_date.slice(0, 10)
            : "",
          purchase_date: initialData.purchase_date
            ? initialData.purchase_date.slice(0, 10)
            : "",
          purchase_price: initialData.purchase_price ?? "",
        }
      : {
          asset_code: "",
          product_name: "",
          category: "",
          serial_number: "",
          purchase_date: "",
          purchase_price: "",
          warranty_expiry_date: "",
          notes: "",
        },
  });

  const handleFormSubmit = (data) => {
    // Chuẩn hóa: empty string → null trước khi gửi lên BE
    const cleaned = {
      ...data,
      purchase_price: data.purchase_price || null,
      purchase_date: data.purchase_date || null,
      warranty_expiry_date: data.warranty_expiry_date || null,
      serial_number: data.serial_number || null,
      notes: data.notes || null,
    };
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Asset Code */}
      <div>
        <label className="block text-sm font-medium mb-1">Mã tài sản *</label>
        <Input
          {...register("asset_code")}
          placeholder="AS-001"
          error={errors.asset_code?.message}
          disabled={isLoading || isEditing}
          className={isEditing ? "bg-muted cursor-not-allowed" : ""}
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground mt-1">
            Không thể thay đổi mã tài sản
          </p>
        )}
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
        <Input
          {...register("product_name")}
          placeholder="MacBook Pro 13 inch"
          error={errors.product_name?.message}
          disabled={isLoading}
        />
      </div>

      {/* Category — dùng ASSET_CATEGORIES từ constants, khớp CHECK constraint VPS */}
      <div>
        <label className="block text-sm font-medium mb-1">Loại *</label>
        <Select
          {...register("category")}
          error={errors.category?.message}
          disabled={isLoading}
        >
          <option value="">-- Chọn loại --</option>
          {ASSET_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </Select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Serial Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Số seri</label>
        <Input
          {...register("serial_number")}
          placeholder="C02R3ABCDEF"
          error={errors.serial_number?.message}
          disabled={isLoading}
        />
      </div>

      {/* Purchase Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày mua</label>
        <Input
          {...register("purchase_date")}
          type="date"
          error={errors.purchase_date?.message}
          disabled={isLoading}
        />
      </div>

      {/* Purchase Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Giá mua (VNĐ)</label>
        <Input
          {...register("purchase_price")}
          type="number"
          min="0"
          placeholder="25000000"
          error={errors.purchase_price?.message}
          disabled={isLoading}
        />
      </div>

      {/* Warranty Expiry Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Hết bảo hành</label>
        <Input
          {...register("warranty_expiry_date")}
          type="date"
          error={errors.warranty_expiry_date?.message}
          disabled={isLoading}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea
          {...register("notes")}
          placeholder="Thông tin bổ sung về tình trạng, cấu hình..."
          rows={3}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                     focus:outline-none focus:ring-primary-500 focus:border-primary-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
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
