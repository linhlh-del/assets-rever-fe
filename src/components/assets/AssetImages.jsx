import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { FileUpload } from "@/components/common/FileUpload";
import { useUploadAssetImages, useDeleteAssetImage } from "@/hooks/useAssets";
import { X, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGES = 10;

export function AssetImages({ assetId, images = [] }) {
  const [previewImage, setPreviewImage] = useState(null);
  const { mutate: uploadImages, isPending } = useUploadAssetImages();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteAssetImage();

  // QUAN TRỌNG: remainingSlots và isFull phải tính lại MỖI LẦN RENDER dựa
  // trên `images` (props, lấy thẳng từ DB qua useAsset()/useAssetAuditTrail).
  // Đây là lý do bug "vẫn upload được hơn 10 ảnh" xảy ra ở bản cũ: maxFiles
  // bị hardcode = 10 (không trừ theo images.length), nên dropzone luôn cho
  // chọn tối đa 10 file MỖI LẦN bấm, bất kể tài sản đã có sẵn bao nhiêu ảnh.
  const remainingSlots = Math.max(0, MAX_IMAGES - images.length);
  const isFull = images.length >= MAX_IMAGES;

  const handleFilesSelected = (files) => {
    if (isFull) {
      toast.error(`Tài sản đã đủ ${MAX_IMAGES} ảnh, không thể thêm`);
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning(
        `Chỉ còn ${remainingSlots} chỗ trống, đã tự động lấy ${remainingSlots} ảnh đầu tiên`,
      );
    }

    // Luôn cắt theo remainingSlots TRƯỚC khi gửi lên BE — không gửi nguyên
    // xi số file người dùng chọn nếu vượt quá chỗ trống còn lại.
    const filesToUpload = files.slice(0, remainingSlots);
    if (filesToUpload.length === 0) return;

    uploadImages(
      {
        assetId,
        files: filesToUpload,
      },
      {
        onSuccess: () => {
          // Images will be refetched automatically
        },
        onError: (err) => {
          toast.error(`Lỗi upload ảnh: ${err.message}`);
        },
      },
    );
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Ảnh tài sản</h3>
          <span className="text-sm text-muted-foreground">
            {images.length}/{MAX_IMAGES} ảnh
          </span>
        </div>

        {/* Upload Area — ẩn hẳn khi đã đủ ảnh, không chỉ disable */}
        {!isFull ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/webp": [".webp"],
              "application/pdf": [".pdf"],
            }}
            maxFiles={remainingSlots}
            maxSize={10 * 1024 * 1024}
            disabled={isPending}
          />
        ) : (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
            Đã đạt giới hạn {MAX_IMAGES} ảnh. Vui lòng xóa bớt ảnh cũ trước khi
            thêm ảnh mới.
          </p>
        )}

        {/* Images Grid */}
        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
              >
                <img
                  src={image.image_url}
                  alt={`Asset ${assetId}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewImage(image.image_url)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn xóa ảnh này?")) {
                        deleteImage(
                          { assetId, imageId: image.id },
                          {
                            onSuccess: () => toast.success("Đã xóa ảnh"),
                            onError: (err) =>
                              toast.error(`Lỗi xóa ảnh: ${err.message}`),
                          },
                        );
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có ảnh nào
          </p>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Xem ảnh</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 bg-muted flex items-center justify-center min-h-96">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain"
                />
              </div>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = previewImage;
                    a.download = "image.jpg";
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewImage(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
