import { create } from 'zustand'

export interface FileTab {
  path: string
  name: string
  dirty: boolean
}

interface WorkspaceState {
  files: FileTab[]
  activeFile: string | null
  openFile: (path: string) => void
  closeFile: (path: string) => void
  setActiveFile: (path: string) => void
  markDirty: (path: string) => void
  markClean: (path: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  files: [],
  activeFile: null,
  openFile: (path) =>
    set((state) => {
      const name = path.split('/').pop() ?? path
      if (state.files.some((f) => f.path === path)) {
        return { activeFile: path }
      }
      return {
        files: [...state.files, { path, name, dirty: false }],
        activeFile: path,
      }
    }),
  closeFile: (path) =>
    set((state) => {
      const files = state.files.filter((f) => f.path !== path)
      const activeFile =
        state.activeFile === path
          ? files.length > 0
            ? files[files.length - 1].path
            : null
          : state.activeFile
      return { files, activeFile }
    }),
  setActiveFile: (path) => set({ activeFile: path }),
  markDirty: (path) =>
    set((state) => ({
      files: state.files.map((f) => (f.path === path ? { ...f, dirty: true } : f)),
    })),
  markClean: (path) =>
    set((state) => ({
      files: state.files.map((f) => (f.path === path ? { ...f, dirty: false } : f)),
    })),
}))
