import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // Habilita acceso desde cualquier IP
    port: 5173, // Puerto predeterminado
    strictPort: true, // No permitir cambiar de puerto
    hmr: {
      host: '192.168.100.11', // Usar tu IP local
      port: 5173,
      protocol: 'ws',
      clientPort: 5173
    },
    watch: {
      usePolling: true // Para sistemas que no soportan fs.watch
    }
  }
})
