import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

export const usePreferencesStore = create(
  persist(
    (set) => ({
      chartPreferences: {
        assets_by_department: 'pie',
        assets_by_status: 'bar',
        assets_over_time: 'line',
        assets_by_category: 'pie',
      },
      updateChartPreference: (chartName, type) =>
        set((state) => ({
          chartPreferences: {
            ...state.chartPreferences,
            [chartName]: type,
          },
        })),
    }),
    {
      name: 'preferences-storage',
    }
  )
)
