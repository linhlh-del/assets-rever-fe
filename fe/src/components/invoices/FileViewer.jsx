import { useState } from 'react'
import { FileText, X, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'

const fileTypeIcons = {
  'application/pdf': '📄',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/webp': '🖼️',
}

export function FileViewer({ file, isOpen, onClose }) {
  const [fullscreen, setFullscreen] = useState(false)

  if (!file || !isOpen) return null

  const isPDF = file.file_type === 'application/pdf'
  const isImage = file.file_type?.startsWith('image/')
  const isOffice = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ].includes(file.file_type)

  const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toUpperCase() || 'FILE'
  }

  return (
    <div className={`fixed inset-0 z-50 ${fullscreen ? 'bg-black' : 'bg-black/80'}`}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <div>
            <p className="font-semibold">{file.filename}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const link = document.createElement('a')
              link.href = file.file_url
              link.download = file.filename
              link.click()
            }}
            className="text-white hover:bg-gray-800"
          >
            <Download className="w-4 h-4" />
          </Button>
          {(isPDF || isImage) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
              className="text-white hover:bg-gray-800"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Viewer */}
      <div className={`flex items-center justify-center ${fullscreen ? 'h-screen' : 'h-[calc(100vh-60px)]'}`}>
        {isPDF ? (
          <iframe
            src={`${file.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full"
            title="PDF Viewer"
          />
        ) : isImage ? (
          <img
            src={file.file_url}
            alt={file.filename}
            className="max-w-full max-h-full object-contain"
          />
        ) : isOffice ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-6xl">
              {fileTypeIcons[file.file_type] || '📄'}
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">{file.filename}</p>
              <p className="text-gray-400 text-sm mt-2">
                Không thể xem trực tiếp trong trình duyệt
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = file.file_url
                  link.download = file.filename
                  link.click()
                }}
              >
                Tải xuống để xem
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <div className="text-6xl mb-4">
              {fileTypeIcons[file.file_type] || '📄'}
            </div>
            <p className="font-semibold">{file.filename}</p>
            <p className="text-gray-400 text-sm mt-2">Định dạng không được hỗ trợ</p>
          </div>
        )}
      </div>
    </div>
  )
}
