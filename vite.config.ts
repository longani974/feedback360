import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: { watch: { usePolling: true } }, // with this line we let firebase emulators create or rename a folder to save data from firebase emulators
});
