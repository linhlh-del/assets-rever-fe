// FIXED BUG-04: handleDownloadTemplate không check null data?.url
// Nếu BE chưa setup bucket handover-templates → user thấy không có gì xảy ra
// Fix: toast.error rõ ràng khi url null
import { useState } from "react";
import { FileUpload } from "@/components/common/FileUpload";
import { Button } from "@/components/common/Button";
import {
  useUploadSlipFile,
  useDeleteSlipFile,
  useDownloadTemplate,
} from "@/hooks/useSlips";
import { Download, FileText, Trash2, Eye, File } from "lucide-react";
import { formatFileSize } from "@/utils/formatters";
import { toast } from "sonner";

const FILE_KIND_LABELS = {
  signed_slip: "Phiếu đã ký",
  attachment: "Đính kèm",
};

const FILE_ICONS = {
  "application/pdf": "📄",
  "image/jpeg": "🖼️",
  "image/jpg": "🖼️",
  "image/png": "🖼️",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "📝",
};

function FileRow({ file, onDelete, canDelete }) {
  const [previewing, setPreviewing] = useState(false);

  const icon = FILE_ICONS[file.file_type] || "📎";
  const isImage = file.file_type?.startsWith("image/");
  const isPdf = file.file_type === "application/pdf";

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.file_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500">
                {file.file_size ? formatFileSize(file.file_size) : ""}
              </span>
              {file.file_size && file.file_kind && (
                <span className="text-gray-300">•</span>
              )}
              {file.file_kind && (
                <span className="text-xs text-blue-600 font-medium">
                  {FILE_KIND_LABELS[file.file_kind] || file.file_kind}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          {(isImage || isPdf) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewing(true)}
              title="Xem trực tiếp"
              className="p-1.5"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const a = document.createElement("a");
              a.href = file.file_url;
              a.download = file.file_name;
              a.click();
            }}
            title="Tải xuống"
            className="p-1.5"
          >
            <Download className="w-4 h-4 text-gray-500" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.id)}
              title="Xóa file"
              className="p-1.5 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {previewing && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewing(false)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="text-sm font-medium truncate">{file.file_name}</p>
              <button
                onClick={() => setPreviewing(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center min-h-64">
              {isImage ? (
                <img
                  src={file.file_url}
                  alt={file.file_name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <iframe
                  src={`${file.file_url}#toolbar=0`}
                  className="w-full h-[70vh]"
                  title={file.file_name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SlipFileUpload({
  slipId,
  files = [],
  onUploadSuccess,
  canManage = true,
}) {
  const { mutate: uploadFile, isPending: isUploading } = useUploadSlipFile();
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteSlipFile();
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useDownloadTemplate();

  const handleFilesSelected = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      uploadFile(
        { slipId, file, file_kind: "signed_slip" },
        {
          onSuccess: () => {
            onUploadSuccess?.();
          },
        },
      );
    });
  };

  const handleDelete = (fileId) => {
    if (!window.confirm("Bạn có chắc muốn xóa file này?")) return;
    deleteFile(
      { slipId, fileId },
      {
        onSuccess: () => {
          onUploadSuccess?.();
        },
      },
    );
  };

  // BUG-04 FIX: kiểm tra data?.url và toast lỗi rõ ràng
  // Trước: nếu data null hoặc không có url → user không biết gì xảy ra
  const handleDownloadTemplate = () => {
    downloadTemplate(undefined, {
      onSuccess: (data) => {
        if (data?.url) {
          window.open(data.url, "_blank");
        } else {
          toast.error(
            "File mẫu chưa được cấu hình. Vui lòng liên hệ IT Admin để upload file mẫu lên hệ thống.",
          );
        }
      },
    });
  };

  const signedFiles = files.filter((f) => f.file_kind === "signed_slip");
  const otherFiles = files.filter((f) => f.file_kind !== "signed_slip");

  return (
    <div className="space-y-5">
      {/* Template download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-900">
              File mẫu phiếu bàn giao
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              Tải về → In → Điền thông tin → Ký tay → Scan → Upload lại bên dưới
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            loading={isDownloading}
            className="flex-shrink-0 flex items-center gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Download className="w-3.5 h-3.5" />
            Tải file mẫu
          </Button>
        </div>
      </div>

      {/* Upload section */}
      {canManage && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Upload phiếu đã ký
          </p>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{
              "application/pdf": [".pdf"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            maxFiles={5}
            maxSize={20 * 1024 * 1024}
            disabled={isUploading || isDeleting}
            helperText="PDF, JPG, PNG, DOCX — Tối đa 20MB/file"
          />
          {isUploading && (
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Đang tải lên...
            </p>
          )}
        </div>
      )}

      {/* Files list */}
      {files.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Files đã upload ({files.length})
          </p>
          <div className="space-y-2">
            {signedFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onDelete={handleDelete}
                canDelete={canManage}
              />
            ))}
            {otherFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onDelete={handleDelete}
                canDelete={canManage}
              />
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && !canManage && (
        <div className="text-center py-6 text-sm text-gray-400">
          <File className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          Chưa có file nào được upload
        </div>
      )}
    </div>
  );
}

export default SlipFileUpload;
