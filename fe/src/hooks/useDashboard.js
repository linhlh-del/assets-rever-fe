import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "@/services/dashboardService";

export const useDashboard = () => {
  const [chartPreferences, setChartPreferences] = useState({
    assetsByDepartment: "pie",
    assetsByStatus: "bar",
    assetsOverTime: "line",
    assetsByCategory: "pie",
  });

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chartPreferences");
    if (saved) {
      try {
        setChartPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chart preferences:", e);
      }
    }
  }, []);

  // Save preferences to localStorage
  const updateChartPreference = (chartName, type) => {
    const updated = {
      ...chartPreferences,
      [chartName]: type,
    };
    setChartPreferences(updated);
    localStorage.setItem("chartPreferences", JSON.stringify(updated));
  };

  // Fetch dashboard data from API
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: {
      totalAssets: dashboardData?.summary?.totalAssets || 0,
      availableAssets: dashboardData?.summary?.availableAssets || 0,
      inUseAssets:
        dashboardData?.statusStats?.find((s) => s.status === "in_use")?.count ||
        0,
      maintenanceAssets:
        dashboardData?.statusStats?.find((s) => s.status === "maintenance")
          ?.count || 0,
      brokenAssets:
        dashboardData?.statusStats?.find((s) => s.status === "broken")?.count ||
        0,
      disposedAssets:
        dashboardData?.statusStats?.find((s) => s.status === "disposed")
          ?.count || 0,
    },
    charts: {
      assetsByCategory: dashboardData?.categoryStats || [],
      assetsByDepartment: dashboardData?.departmentStats || [],
      assetsByStatus: dashboardData?.statusStats || [],
      assetsOverTime: [],
    },
    widgets: dashboardData?.widgets || {
      expiringWarranty: [],
      brokenAssets: [],
    },
    chartPreferences,
    updateChartPreference,
    isLoading,
    error,
  };
};
