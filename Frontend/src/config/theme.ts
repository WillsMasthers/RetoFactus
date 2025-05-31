export const colors = {
  background: {
    light: '#ffffff', // Fondo principal modo claro
    dark: '#0f172a' // Fondo principal modo oscuro (slate-900)
  },
  surface: {
    light: '#f8fafc', // Superficie/Tarjeta modo claro (slate-50)
    dark: '#1e293b' // Superficie/Tarjeta modo oscuro (slate-800)
  },
  text: {
    light: '#0f172a', // Texto principal modo claro (slate-900)
    dark: '#f8fafc' // Texto principal modo oscuro (slate-50)
  },
  textSecondary: {
    light: '#475569', // Texto secundario modo claro (slate-600)
    dark: '#cbd5e1' // Texto secundario modo oscuro (slate-300)
  },
  textMuted: {
    light: '#64748b', // Texto atenuado modo claro (slate-500)
    dark: '#94a3b8' // Texto atenuado modo oscuro (slate-400)
  },
  border: {
    light: '#e2e8f0', // Borde modo claro (slate-200)
    dark: '#334155' // Borde modo oscuro (slate-700)
  },
  input: {
    background: {
      light: '#ffffff', // Fondo input modo claro
      dark: '#020617' // Fondo input modo oscuro (gray-950 - para coincidir con SelectNative)
    },
    border: {
      light: '#e2e8f0', // Borde input modo claro
      dark: '#1e293b' // Borde input modo oscuro (gray-800 - para coincidir con SelectNative)
    },
    text: {
      light: '#0f172a', // Texto input modo claro
      dark: '#f8fafc' // Texto input modo oscuro (gray-50 - para coincidir con SelectNative)
    },
    placeholder: {
      light: '#94a3b8', // Placeholder input modo claro (slate-400)
      dark: '#64748b' // Placeholder input modo oscuro (gray-500 - para coincidir con SelectNative)
    }
  },
  primary: {
    light: '#0284c7', // blue-600
    dark: '#0ea5e9' // blue-500
  },
  secondary: {
    light: '#7c3aed', // violet-600
    dark: '#8b5cf6' // violet-500
  },
  tertiary: {
    light: '#059669', // emerald-600
    dark: '#10b981' // emerald-500
  },
  success: {
    light: '#16a34a', // green-600
    dark: '#22c55e' // green-500
  },
  warning: {
    light: '#d97706', // amber-600
    dark: '#f59e0b' // amber-500
  },
  danger: {
    light: '#dc2626', // red-600
    dark: '#ef4444' // red-500
  },
  info: {
    light: '#0891b2', // cyan-600
    dark: '#06b6d4' // cyan-500
  },
  hover: {
    light: '#f1f5f9', // slate-100
    dark: '#1e293b' // slate-800
  }
}

export type ThemeColors = typeof colors
