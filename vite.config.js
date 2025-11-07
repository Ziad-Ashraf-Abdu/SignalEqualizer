import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" // <-- Add this line

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: { // <-- Add this entire 'resolve' section
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})