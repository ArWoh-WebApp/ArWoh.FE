import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    publicDir: 'public', // This ensures Vite serves files from the public directory
    // Ensure the Vite development server listens on 0.0.0.0 and port 3000
    server: {
        host: '0.0.0.0', // Bind to 0.0.0.0 to make the server accessible outside the container
        port: 3000, // Set the port to 3000
    },
});
