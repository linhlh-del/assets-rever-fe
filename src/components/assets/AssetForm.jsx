// components/assets/AssetForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { FileUpload } from "@/components/common/FileUpload";
import { ASSET_CATEGORIES } from "@/utils/constants";
import { formatVND } from "@/utils/formatters";
import { useInvoiceOptions } from "@/hooks/useInvoices";

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
  invoice_id: z.string().uuid().optional().nullable().or(z.literal("")),
  notes: z.string().optional().nullable(),
});

export function AssetForm({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
  showImageUpload = false,
  pendingImages = [],
  onImagesChange,
}) {
  const { data: invoices = [], isLoading: invoicesLoading } =
    useInvoiceOptions();

  const {
    register,
    handleSubmit,
    watch,
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
          invoice_id: initialData.invoice_id || "",
        }
      : {
          asset_code: "",
          product_name: "",
          category: "",
          serial_number: "",
          purchase_date: "",
          purchase_price: "",
          warranty_expiry_date: "",
          invoice_id: "",
          notes: "",
        },
  });

  const purchasePrice = watch("purchase_price");
  const pricePreview =
    purchasePrice && !isNaN(Number(purchasePrice)) && Number(purchasePrice) > 0
      ? formatVND(purchasePrice)
      : null;

  const handleFormSubmit = (data) => {
    const cleaned = {
      ...data,
      purchase_price: data.purchase_price || null,
      purchase_date: data.purchase_date || null,
      warranty_expiry_date: data.warranty_expiry_date || null,
      serial_number: data.serial_number || null,
      invoice_id: data.invoice_id || null,
      notes: data.notes || null,
    };
    onSubmit(cleaned);
  };

  const handleFilesSelected = (files) => {
    if (onImagesChange) {
      onImagesChange([...pendingImages, ...files].slice(0, 10)); // giới hạn 10 files
    }
  };

  const handleRemoveImage = (index) => {
    if (onImagesChange) {
      onImagesChange(pendingImages.filter((_, i) => i !== index));
    }
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

      {/* Category */}
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

      {/* Invoice */}
      <div>
        <label className="block text-sm font-medium mb-1">Hóa đơn</label>
        <Select
          {...register("invoice_id")}
          disabled={isLoading || invoicesLoading}
        >
          <option value="">
            {invoicesLoading
              ? "Đang tải hóa đơn..."
              : "-- Chọn hóa đơn (không bắt buộc) --"}
          </option>
          {invoices.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.invoice_number} — {inv.supplier || "N/A"}
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Liên kết tài sản với hóa đơn mua hàng từ kế toán
        </p>
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
        {pricePreview && (
          <p className="text-xs text-muted-foreground mt-1">≈ {pricePreview}</p>
        )}
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

      {/* Image Upload (create mode only) */}
      {showImageUpload && (
        <div>
          <FileUpload
            label="Ảnh tài sản"
            onFilesSelected={handleFilesSelected}
            files={pendingImages}
            onRemove={handleRemoveImage}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/webp": [".webp"],
              "application/pdf": [".pdf"],
            }}
            maxFiles={10}
            maxSize={10 * 1024 * 1024}
            disabled={isLoading}
            helperText="Ảnh sẽ được tải lên sau khi tạo tài sản thành công"
          />
        </div>
      )}

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
