/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores específicos solicitados (mapeados a variables CSS)
        'dark-imperiable-blue': 'var(--color-dark-imperiable-blue)',
        'oxford-blue': 'var(--color-oxford-blue)',
        'cetacean-blue': 'var(--color-cetacean-blue)',
        'rich-black': 'var(--color-rich-black)',
        'vista-blue': 'var(--color-vista-blue)',

        // Paleta de azul-gris
        bg: {
          1: 'var(--color-bg-1)',
          2: 'var(--color-bg-2)',
          3: 'var(--color-bg-3)',
          4: 'var(--color-bg-4)',
          5: 'var(--color-bg-5)'
        },
        // Colores temáticos usando variables CSS
        container: 'var(--color-container)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        textSecondary: 'var(--color-text-secondary)',
        textMuted: 'var(--color-text-muted)',
        border: 'var(--color-border)',
        input: {
          background: 'var(--color-input-background)',
          border: 'var(--color-input-border)',
          text: 'var(--color-input-text)',
          placeholder: 'var(--color-input-placeholder)'
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-hover)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-hover)'
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          hover: 'var(--color-hover)'
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)'
      }
      // Puedes añadir aquí otras extensiones de tema si es necesario (spacing, etc.)
    }
  },
  plugins: []
}
