import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Loading } from "@/components/common/Loading";
import { AssetImages } from "@/components/assets/AssetImages";
import { useAsset, useAssetAuditTrail } from "@/hooks/useAssets";
import {
  ArrowLeft,
  Edit2,
  Send,
  RotateCcw,
  AlertTriangle,
  Trash2,
} from "lucide-react";

const statusColors = {
  available: "success",
  in_use: "primary",
  maintenance: "default",
  broken: "secondary",
  disposed: "secondary",
};

const statusLabels = {
  available: "Khả dụng",
  in_use: "Đang sử dụng",
  maintenance: "Bảo trì",
  broken: "Hỏng hóc",
  disposed: "Đã thanh lý",
};

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const { data: asset, isLoading } = useAsset(assetId);
  const { data: auditTrail } = useAssetAuditTrail(assetId);

  if (isLoading) {
    console.log("🔍 asset data:", asset);
    return <Loading />;
  }
  if (!asset)
    return <div className="text-center py-12">Không tìm thấy tài sản</div>;

  const warrantyEndDate = asset.warranty_end_date
    ? new Date(asset.warranty_end_date)
    : null;
  const isWarrantyExpiring =
    warrantyEndDate && warrantyEndDate - new Date() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{asset.product_name}</h1>
            <p className="text-muted-foreground">{asset.asset_code}</p>
          </div>
        </div>
        <Badge variant={statusColors[asset.status]}>
          {statusLabels[asset.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Mã tài sản</p>
                <p className="font-semibold">{asset.asset_code}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Số seri</p>
                <p className="font-semibold">{asset.serial_number || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loại</p>
                <p className="font-semibold">{asset.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bộ phận</p>
                <p className="font-semibold">
                  {asset.current_department || asset.department || "-"}
                </p>
              </div>
            </div>
          </Card>

          {/* Financial Info */}
          <Card>
            <h3 className="font-semibold mb-4">Thông tin tài chính</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Giá mua</p>
                <p className="font-semibold">
                  {asset.purchase_price?.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ngày mua</p>
                <p className="font-semibold">
                  {new Date(asset.purchase_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </Card>

          {/* Warranty Info */}
          {asset.warranty_end_date && (
            <Card
              className={
                isWarrantyExpiring ? "border-yellow-200 bg-yellow-50" : ""
              }
            >
              <h3 className="font-semibold mb-4">Bảo hành</h3>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Hết bảo hành</p>
                  <p className="font-semibold">
                    {new Date(asset.warranty_end_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
                {isWarrantyExpiring && (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">Sắp hết hạn</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Notes */}
          {asset.notes && (
            <Card>
              <h3 className="font-semibold mb-2">Ghi chú</h3>
              <p className="text-sm text-foreground">{asset.notes}</p>
            </Card>
          )}

          {/* Images */}
          <AssetImages
            assetCode={asset.asset_code}
            images={asset.asset_images}
          />

          {/* Audit Trail */}
          <Card>
            <h3 className="font-semibold mb-4">Lịch sử gán tài sản</h3>
            {auditTrail && auditTrail.length > 0 ? (
              <div className="space-y-3">
                {auditTrail.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="pb-3 border-b last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        {/* ✅ Dùng trực tiếp full_name và employee_code từ bảng */}
                        <p className="font-medium text-sm">
                          {item.full_name || item.employee_code || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.employee_code}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>
                          Gán:{" "}
                          {new Date(item.from_date).toLocaleDateString("vi-VN")}
                        </p>
                        {item.to_date ? (
                          <p className="text-red-600">
                            Trả:{" "}
                            {new Date(item.to_date).toLocaleDateString("vi-VN")}
                          </p>
                        ) : (
                          <p className="text-green-600 font-medium">
                            Đang sử dụng
                          </p>
                        )}
                      </div>
                    </div>
                    {item.department && (
                      <p className="text-xs text-muted-foreground">
                        {item.department}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có lịch sử gán
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </Button>

              {asset.status === "available" && (
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Phân công
                </Button>
              )}

              {asset.status === "in_use" && (
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Thu hồi
                </Button>
              )}

              {asset.status !== "disposed" && (
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full flex items-center gap-2 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  Thanh lý
                </Button>
              )}
            </div>
          </Card>

          {/* Status Info */}
          <Card>
            <h3 className="font-semibold mb-3">Trạng thái</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Hiện tại</p>
                <Badge
                  variant={statusColors[asset.status]}
                  className="w-full text-center justify-center"
                >
                  {statusLabels[asset.status]}
                </Badge>
              </div>

              {asset.status === "in_use" &&
                asset.current_user_employee_code && (
                  <div>
                    <p className="text-xs text-muted-foreground">Người dùng</p>
                    <p className="font-semibold text-sm">
                      {asset.current_user_employee_code}
                    </p>
                  </div>
                )}

              {asset.assigned_date && (
                <div>
                  <p className="text-xs text-muted-foreground">Ngày gán</p>
                  <p className="text-sm">
                    {new Date(asset.assigned_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Info Box */}
          <Card className="bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-900">
              Chỉnh sửa thông tin cơ bản, phân công hoặc thu hồi tài sản từ giao
              diện này.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
