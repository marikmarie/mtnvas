import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		hmr: true,
		port: 3000,
		open: true,
	},
	optimizeDeps: {
		exclude: ['days'],
	},
});
