import { create } from 'zustand'

interface Keybinding {
  key: string
  command: string
  label: string
}

interface KeybindingsState {
  bindings: Keybinding[]
  setBinding: (command: string, key: string) => void
  resetDefaults: () => void
}

const defaults: Keybinding[] = [
  { key: 'mod+s', command: 'save', label: 'Save File' },
  { key: 'mod+w', command: 'close-tab', label: 'Close Tab' },
  { key: 'mod+shift+p', command: 'command-palette', label: 'Command Palette' },
  { key: 'ctrl+`', command: 'toggle-terminal', label: 'Toggle Terminal' },
  { key: 'mod+b', command: 'toggle-sidebar', label: 'Toggle Sidebar' },
]

export const useKeybindingsStore = create<KeybindingsState>((set) => ({
  bindings: defaults,
  setBinding: (command, key) => set(state => ({
    bindings: state.bindings.map(b => b.command === command ? { ...b, key } : b),
  })),
  resetDefaults: () => set({ bindings: defaults }),
}))
