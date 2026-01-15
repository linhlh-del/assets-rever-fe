import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { FileUpload } from '@/components/common/FileUpload'
import { useUploadAssetImages } from '@/hooks/useAssets'
import { X, Download, Eye } from 'lucide-react'

export function AssetImages({ assetCode, images = [] }) {
  const [previewImage, setPreviewImage] = useState(null)
  const { mutate: uploadImages, isPending } = useUploadAssetImages()

  const handleFilesSelected = (files) => {
    uploadImages(
      {
        assetCode,
        files: files,
      },
      {
        onSuccess: () => {
          // Images will be refetched automatically
        },
      }
    )
  }

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Ảnh tài sản</h3>

        {/* Upload Area */}
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
          disabled={isPending}
        />

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
                  alt={`Asset ${assetCode}`}
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
                    onClick={() => {
                      // Delete image functionality
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
            <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
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
                    const a = document.createElement('a')
                    a.href = previewImage
                    a.download = 'image.jpg'
                    a.click()
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
  )
}
