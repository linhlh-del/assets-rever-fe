import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceFilters } from "@/components/invoices/InvoiceFilters";
import { InvoicesList } from "@/components/invoices/InvoicesList";
import { AddInvoiceModal } from "@/components/invoices/AddInvoiceModal";
import { InvoiceDetailModal } from "@/components/invoices/InvoiceDetailModal";
import { usePermission } from "@/hooks/usePermission";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    dateFrom: null,
    dateTo: null,
    page: 1,
    limit: 20,
  });

  // Permissions
  const { canCreateInvoice } = usePermission();

  // Data
  const { data, isLoading } = useInvoices(filters);
  const invoices = data?.data || [];
  const total = data?.total || 0;

  // Pagination
  const handleNextPage = () => {
    setFilters((f) => ({ ...f, page: f.page + 1 }));
  };

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters((f) => ({ ...f, page: f.page - 1 }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Hóa Đơn</h1>
          <p className="text-muted-foreground">
            Quản lý hóa đơn và chứng từ tài sản
          </p>
        </div>
        {canCreateInvoice && (
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm hóa đơn
          </Button>
        )}
      </div>

      {/* Filters */}
      <InvoiceFilters filters={filters} onFiltersChange={setFilters} />

      {/* Invoices Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg border">
          <InvoicesList
            invoices={invoices}
            isLoading={isLoading}
            onView={setViewingInvoice}
          />
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(filters.page - 1) * filters.limit + 1} đến{" "}
            {Math.min(filters.page * filters.limit, total)} của {total} hóa đơn
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={filters.page === 1}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={filters.page * filters.limit >= total}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <InvoiceDetailModal
        isOpen={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
      />
    </div>
  );
}
