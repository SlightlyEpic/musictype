import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import path from 'path';

export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './app.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild',
            swcOptions: {}
        })
    ],
    resolve: {
        alias: {
            '@public': path.join(__dirname, '/public'),
            '@routers': path.join(__dirname, '/routers'),
            '@mytypes': path.join(__dirname, '/types')
        }
    },
    optimizeDeps: {},
    publicDir: false,
    build: {
        outDir: './serverDist'
    }
});