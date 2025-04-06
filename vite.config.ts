import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// import UnoCSS from 'unocss/vite';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        // UnoCSS(),
        svelte(),
        AutoImport({
            imports: [
                'svelte',
                'svelte/store',
                'svelte/transition',
                {
                    axios: [
                        ['default', 'axios'], // import { default as axios } from 'axios',
                    ],
                    'lodash-es': [
                        ['range', 'linspace'],
                        'isEmpty',
                        'isArray',
                        'isObject',
                        'isString',
                        'isNumber',
                        'isInteger',
                        'isBoolean',
                    ],
                    '@zmotivat0r/o0': ['oO'],
                    '$lib/utils/toast': ['toast', 'Toaster'],
                    '$lib/utils/logger': ['logger'],
                    'svelte-persisted-store': [['persisted', 'localWritable']],
                    '$lib/pyserver/computePy': [['default', 'computePy']],
                    '$lib/utils/initialise': ['getID', 'sleep'],
                    '$lib/utils/index': [
                        // 'localWritable',
                        'typeSafeObjectKeys',
                        'safeJsonParse',
                        'safeJsonStringify',
                        'readJSON',
                        'writeJSON',
                        'fs',
                        'path',
                        'dialog',
                        'shell',
                        'os',
                        'invoke',
                        'platform',
                        'arch',
                        'getVersion',
                        'getTauriVersion',
                        'checkUpdate',
                        'installUpdate',
                        'relaunch',
                        'listen',
                        'open_filepath',
                        'btn_dispatch_event',
                    ],
                },
            ],
            dts: './src/auto-imports.d.ts',
        }),
        ViteYaml(),
    ],
    resolve: {
        alias: {
            'plotly.js-dist': 'plotly.js-dist-min',
            $lib: path.resolve('./src/lib/'),
            $pages: path.resolve('./src/pages/'),
            $utils: path.resolve('./src/utils/'),
            $settings: path.resolve('./src/pages/settings/'),
            $components: path.resolve('./src/lib/components/'),
        },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
    envPrefix: ['VITE_'],
    build: {
        chunkSizeWarningLimit: 2000,
        // rollupOptions: {
        //     output: {
        //         manualChunks: {},
        //     },
        // },
    },
}));
