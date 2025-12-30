import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force update for Vercel synchronization
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})
