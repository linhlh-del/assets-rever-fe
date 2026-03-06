import { useEffect, useState } from "react";
import { supabase } from "@/services/api";

export function TestSupabase() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        console.log("🔍 Testing simple Supabase connection...");
        // First test simple query
        const { data: simpleData, error: simpleError } = await supabase
          .from("assets")
          .select("*")
          .limit(5);

        if (simpleError) {
          console.error("❌ Simple query error:", simpleError);
          setError(`Simple query error: ${simpleError.message}`);
          return;
        }

        console.log("✅ Simple query successful:", simpleData);

        // Now test complex query that's failing
        console.log("🔍 Testing complex Supabase query...");
        const { data: complexData, error: complexError } = await supabase
          .from("assets")
          .select(
            `
            *,
            asset_history(user_employee_code, from_date, to_date)
          `,
            { count: "exact" }
          )
          .limit(5);

        if (complexError) {
          console.error("❌ Complex query error:", complexError);
          setError(`Complex query error: ${complexError.message}`);
          setAssets(simpleData || []);
        } else {
          console.log("✅ Complex query successful:", complexData);
          setAssets(complexData || []);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">🧪 Supabase Connection Test</h2>

      {loading && <div className="text-blue-600">Đang kiểm tra kết nối...</div>}

      {error && (
        <div className="text-red-600 mb-4">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="text-green-600 mb-4">
          <strong>✅ Kết nối thành công!</strong>
        </div>
      )}

      <div className="mb-4">
        <strong>Số tài sản tìm thấy:</strong> {assets.length}
      </div>

      {assets.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Danh sách tài sản:</h3>
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-2 border rounded bg-white dark:bg-gray-700"
            >
              <strong>{asset.asset_code}</strong> - {asset.product_name}
              <br />
              <small className="text-gray-600">
                Trạng thái: {asset.status} | Lịch sử:{" "}
                {asset.asset_history?.length || 0} bản ghi
              </small>
            </div>
          ))}
        </div>
      )}

      {assets.length === 0 && !loading && !error && (
        <div className="text-yellow-600">
          ⚠️ Cơ sở dữ liệu trống - chưa có tài sản nào được thêm vào.
        </div>
      )}
    </div>
  );
}

export default TestSupabase;
