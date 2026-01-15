import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { FileUpload } from '@/components/common/FileUpload'
import { useUploadInvoiceFile } from '@/hooks/useInvoices'
import { File, X, Eye } from 'lucide-react'
import { FileViewer } from './FileViewer'

const supportedFormats = [
  { ext: 'PDF', icon: '📄', type: 'application/pdf' },
  { ext: 'Excel', icon: '📊', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { ext: 'Word', icon: '📝', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { ext: 'Images', icon: '🖼️', type: 'image/*' },
]

export function InvoiceFileUpload({ invoiceNumber, invoiceFiles = [] }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const { mutate: uploadFile, isPending } = useUploadInvoiceFile()

  const handleFilesSelected = (files) => {
    files.forEach(file => {
      uploadFile(
        {
          invoiceNumber,
          file,
        },
        {
          onSuccess: () => {
            // Files list will be refetched
          },
        }
      )
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tải lên tài liệu hóa đơn
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Hỗ trợ: PDF, Excel, Word, Images (Tối đa 10MB/file, 5 files)
        </p>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.webp"
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          disabled={isPending}
        />
      </div>

      {/* Uploaded Files */}
      {invoiceFiles && invoiceFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tài liệu đã tải ({invoiceFiles.length})</h4>
          <div className="space-y-2">
            {invoiceFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-lg w-8 flex-shrink-0">📄</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(file)
                      setViewerOpen(true)
                    }}
                    title="Xem"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = file.file_url
                      link.download = file.filename
                      link.click()
                    }}
                    title="Tải xuống"
                  >
                    <File className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Viewer */}
      <FileViewer
        file={selectedFile}
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false)
          setSelectedFile(null)
        }}
      />
    </div>
  )
}
