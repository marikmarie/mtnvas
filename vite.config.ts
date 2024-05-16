import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig( {
	plugins: [react()],
	server: {
		hmr: true,
		port: 3000,
		open: true,
	},
	optimizeDeps: {
		exclude: ['days'],
	},
} )
