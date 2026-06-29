import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface AppearanceState {
  theme: Theme
  sidebarOpen: boolean
  sidebarWidth: number
  bottomPanelOpen: boolean
  bottomPanelHeight: number
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  toggleBottomPanel: () => void
  setBottomPanelHeight: (height: number) => void
}

export const useAppearanceStore = create<AppearanceState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  sidebarWidth: 260,
  bottomPanelOpen: true,
  bottomPanelHeight: 200,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
  toggleBottomPanel: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
  setBottomPanelHeight: (bottomPanelHeight) => set({ bottomPanelHeight }),
}))
