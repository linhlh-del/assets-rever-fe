export function Empty({ message = 'Không có dữ liệu' }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
