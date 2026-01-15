export function PageHeader({ title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
