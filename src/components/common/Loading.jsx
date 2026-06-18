import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const Loading = ({ fullScreen = false, text = 'Đang tải...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      </div>
    </div>
  )
}

export { Loading }
export default Loading

