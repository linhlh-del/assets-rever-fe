import { useState } from "react";
import { supabase } from "@/services/api";

export function DatabaseSetup() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const runSetup = async () => {
    setLoading(true);
    setStatus("🚀 Bắt đầu thiết lập database...");

    try {
      // Test connection first
      setStatus("🔍 Kiểm tra kết nối...");
      const { data: testData, error: testError } = await supabase
        .from("assets")
        .select("count", { count: "exact", head: true });

      if (testError && testError.code === "PGRST116") {
        // Table doesn't exist, let's create it
        setStatus("📋 Tạo bảng assets...");

        // Create assets table using RPC or direct SQL
        // Since we can't run DDL directly, we'll use a workaround
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS assets (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              asset_code VARCHAR(50) UNIQUE NOT NULL,
              product_name VARCHAR(200) NOT NULL,
              category VARCHAR(50) NOT NULL,
              status VARCHAR(20) DEFAULT 'available',
              created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS asset_history (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              asset_id UUID REFERENCES assets(id),
              action_type VARCHAR(20) NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
          `,
        });

        if (createError) {
          setStatus(`❌ Lỗi tạo bảng: ${createError.message}`);
          return;
        }

        setStatus("✅ Đã tạo bảng thành công!");
      } else if (!testError) {
        setStatus("✅ Database đã được thiết lập!");
      } else {
        setStatus(`❌ Lỗi kết nối: ${testError.message}`);
      }
    } catch (err) {
      setStatus(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const insertSampleData = async () => {
    setLoading(true);
    setStatus("📝 Thêm dữ liệu mẫu...");

    try {
      const sampleAssets = [
        {
          asset_code: "LAP001",
          product_name: "Dell Latitude 5420",
          category: "Laptop",
          status: "available",
        },
        {
          asset_code: "MON001",
          product_name: 'Dell Monitor 24"',
          category: "Monitor",
          status: "available",
        },
        {
          asset_code: "KB001",
          product_name: "Logitech Keyboard",
          category: "Keyboard",
          status: "available",
        },
      ];

      const { error } = await supabase
        .from("assets")
        .upsert(sampleAssets, { onConflict: "asset_code" });

      if (error) {
        setStatus(`❌ Lỗi thêm dữ liệu: ${error.message}`);
      } else {
        setStatus("✅ Đã thêm dữ liệu mẫu thành công!");
      }
    } catch (err) {
      setStatus(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <h2 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">
        🛠️ Thiết lập Database Supabase
      </h2>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {status || "Chưa bắt đầu thiết lập"}
        </div>

        <div className="flex gap-4">
          <button
            onClick={runSetup}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Thiết lập Database"}
          </button>

          <button
            onClick={insertSampleData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Thêm Dữ liệu Mẫu"}
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <strong>Lưu ý:</strong> Nếu các nút trên không hoạt động, hãy chạy
          file
          <code className="bg-gray-100 px-1 rounded">
            database_schema.sql
          </code>{" "}
          trong Supabase SQL Editor.
        </div>
      </div>
    </div>
  );
}
