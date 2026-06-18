export function Pagination({ currentPage, pageCount, onPageChange }) {
  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        Trang trước
      </button>
      <span className="text-sm text-muted-foreground">
        Trang {currentPage} của {pageCount}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        Trang sau
      </button>
    </div>
  )
}
