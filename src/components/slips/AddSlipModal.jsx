// AddSlipModal.jsx
// 2-step flow:
//   Step 1 — SlipForm: chọn người nhận + tài sản + ghi chú → tạo phiếu
//   Step 2 — File section: download template + upload phiếu đã ký → xong hoặc skip
//
// Hỗ trợ prop defaultAssetId để pre-select tài sản khi mở từ AssetDetail/AssetsPage

import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { SlipForm } from "./SlipForm";
import { SlipFileUpload } from "./SlipFileUpload";
import { useCreateAssignmentSlip } from "@/hooks/useSlips";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ currentStep }) {
  const steps = [
    { id: 1, label: "Thông tin phiếu" },
    { id: 2, label: "Đính kèm file" },
  ];

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                transition-colors duration-200
                ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }
              `}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep === step.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex items-center mx-3">
              <div
                className={`h-px w-8 transition-colors duration-200 ${
                  currentStep > step.id ? "bg-green-400" : "bg-border"
                }`}
              />
              <ArrowRight className="w-3 h-3 text-muted-foreground mx-0.5" />
              <div
                className={`h-px w-8 transition-colors duration-200 ${
                  currentStep > step.id ? "bg-green-400" : "bg-border"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 2 content ───────────────────────────────────────────────────────────
function UploadStep({ slip, onClose }) {
  return (
    <div className="space-y-5">
      {/* Slip summary */}
      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-green-900">
            Phiếu {slip.slip_number} đã được tạo
          </p>
          <p className="text-green-700 mt-0.5">
            Bạn có thể tải file mẫu, in, ký tay rồi upload lại — hoặc bỏ qua và
            upload sau trong chi tiết phiếu.
          </p>
        </div>
      </div>

      {/* File upload component — tái dùng từ SlipDetailModal */}
      <SlipFileUpload
        slipId={slip.id}
        files={[]}
        onUploadSuccess={() => {}}
        canManage={true}
      />

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button variant="ghost" onClick={onClose}>
          Bỏ qua, xong sau
        </Button>
        <Button onClick={onClose}>Hoàn tất</Button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
// Props:
//   isOpen         — boolean
//   onClose        — () => void
//   defaultAssetId — string | undefined  → pre-select asset khi mở từ AssetDetail
export function AddSlipModal({ isOpen, onClose, defaultAssetId }) {
  const [step, setStep] = useState(1);
  const [createdSlip, setCreatedSlip] = useState(null);

  const { mutate: createSlip, isPending } = useCreateAssignmentSlip();

  // Reset về step 1 khi đóng modal
  const handleClose = () => {
    setStep(1);
    setCreatedSlip(null);
    onClose();
  };

  const handleSubmit = (data) => {
    createSlip(data, {
      onSuccess: (slip) => {
        // slip = res?.data?.slip từ slipService.createAssignmentSlip
        if (slip?.id) {
          setCreatedSlip(slip);
          setStep(2);
        } else {
          // fallback nếu BE không trả slip object (chỉ báo thành công)
          handleClose();
        }
      },
    });
  };

  const title = step === 1 ? "Tạo phiếu bàn giao" : "Đính kèm file phiếu";
  const description =
    step === 1
      ? "Bàn giao tài sản cho nhân viên"
      : "Tải file mẫu hoặc upload phiếu đã ký";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
    >
      <StepBar currentStep={step} />

      {step === 1 && (
        <SlipForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          defaultAssetId={defaultAssetId}
        />
      )}

      {step === 2 && createdSlip && (
        <UploadStep slip={createdSlip} onClose={handleClose} />
      )}
    </Modal>
  );
}
