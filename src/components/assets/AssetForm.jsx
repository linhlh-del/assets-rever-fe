// components/assets/AssetForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";

const categories = [
  "laptop",
  "PC",
  "man hinh",
  "Mạng",
  "Tủ lạnh",
  "Đồ nội thất",
  "Khác",
];

const assetSchema = z.object({
  asset_code: z.string().min(1, "Mã tài sản không được để trống"),
  product_name: z.string().min(1, "Tên sản phẩm không được để trống"),
  category: z.string().min(1, "Vui lòng chọn loại"),
  serial_number: z.string().optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.coerce
    .number()
    .positive("Giá phải lớn hơn 0")
    .optional()
    .or(z.literal("")),
  warranty_expiry_date: z.string().optional(), // ✅ đổi từ warranty_end_date
  notes: z.string().optional(),
});

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
          // ✅ map warranty_expiry_date từ DB vào form
          warranty_expiry_date: initialData.warranty_expiry_date
            ? initialData.warranty_expiry_date.slice(0, 10)
            : "",
          purchase_date: initialData.purchase_date
            ? initialData.purchase_date.slice(0, 10)
            : "",
          purchase_price: initialData.purchase_price || "",
        }
      : {
          asset_code: "",
          product_name: "",
          category: "",
          serial_number: "",
          purchase_date: "",
          purchase_price: "",
          warranty_expiry_date: "", // ✅ đổi từ warranty_end_date
          notes: "",
        },
  });

  const handleFormSubmit = (data) => {
    // ✅ Làm sạch data trước khi gửi — bỏ empty string thành null
    const cleaned = {
      ...data,
      purchase_price: data.purchase_price || null,
      purchase_date: data.purchase_date || null,
      warranty_expiry_date: data.warranty_expiry_date || null, // ✅ đúng tên cột DB
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
          placeholder="AS001"
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

      {/* Category */}
      <Select
        label="Loại *"
        {...register("category")}
        error={errors.category?.message}
        disabled={isLoading}
      >
        <option value="">-- Chọn loại --</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>

      {/* Serial Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Số seri</label>
        <Input
          {...register("serial_number")}
          placeholder="C02R3..."
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
          placeholder="25000000"
          error={errors.purchase_price?.message}
          disabled={isLoading}
        />
      </div>

      {/* Warranty Expiry Date — ✅ đổi tên field */}
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
          placeholder="Thông tin bổ sung..."
          rows="3"
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
