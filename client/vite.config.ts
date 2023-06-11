import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    optimizeDeps: {},
    resolve: {
        alias: {
            '@': path.join(__dirname, '/src'),
            '@cmp': path.join(__dirname, '/src/components'),
            '@helperScripts': path.join(__dirname, '/src/helperScripts'),
            '@styles': path.join(__dirname, '/src/styles'),
            '@pages': path.join(__dirname, '/src/pages')
        }
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
            '/audio': 'http://localhost:3000',
            '/lyrics': 'http://localhost:3000',
            '/fonts': 'http://localhost:3000',
            '/favicon.ico': 'http://localhost:3000'
        }
    },
    build: {
        outDir: './clientDist/'
    },
});
