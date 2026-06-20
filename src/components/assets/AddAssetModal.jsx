import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/common/Modal";
import { AssetForm } from "./AssetForm";
import { useCreateAsset } from "@/hooks/useAssets";
import { uploadAssetImages } from "@/services/assetService";
import { toast } from "sonner";

export function AddAssetModal({ isOpen, onClose, invoiceNumber }) {
  const navigate = useNavigate();
  const [pendingImages, setPendingImages] = useState([]);
  const { mutate: createAsset, isPending } = useCreateAsset();

  const handleClose = () => {
    setPendingImages([]);
    onClose();
  };

  const handleSubmit = (data) => {
    createAsset(
      {
        ...data,
        status: "available",
      },
      {
        onSuccess: async (newAsset) => {
          const assetId = newAsset?.id;
          if (assetId && pendingImages.length > 0) {
            try {
              await uploadAssetImages(assetId, pendingImages);
              toast.success("Tạo tài sản và upload ảnh thành công");
            } catch {
              toast.warning(
                "Tạo tài sản thành công nhưng upload ảnh thất bại. Bạn có thể upload lại ở trang chi tiết.",
              );
            }
          } else {
            toast.success("Tạo tài sản thành công");
          }

          handleClose();
          if (assetId) {
            navigate(`/assets/${assetId}`);
          }
        },
        onError: (error) => {
          toast.error(`Lỗi tạo tài sản: ${error.message}`);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm tài sản mới"
      description={
        invoiceNumber
          ? `Thêm tài sản từ hóa đơn ${invoiceNumber}`
          : "Nhập thông tin tài sản mới"
      }
    >
      <AssetForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        showImageUpload
        pendingImages={pendingImages}
        onImagesChange={setPendingImages}
      />
    </Modal>
  );
}
