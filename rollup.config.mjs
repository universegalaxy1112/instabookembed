import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external'
import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import ts     from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs'
import dotenv from 'dotenv'

// import .env variables
dotenv.config();

function basePlugins() {
    return [
        external(),
        url(),
        json(),
        ts(),
        commonjs({}),
        // minify if we're building for production
        // (aka. npm run build instead of npm run dev)
        terser({
            keep_classnames: false,
            keep_fnames: false,
            output: {
                comments: false,
            },
        }),
    ]
}

export default [
    // ES bundle (the Instabook EmbedApi as default export + additional helper classes).
    {
        input: 'src/index.ts',
        output: [
            {
                file:      'dist/instabook.es.mjs',
                format:    'es',
                sourcemap: true,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // ES bundle but with .js extension.
    {
        input: 'src/index.ts',
        output: [
            {
                file:      'dist/instabook.es.js',
                format:    'es',
                sourcemap: true,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // UMD bundle (only the Instabook Embed EmbedApi as default export).
    {
        input: 'src/EmbedApi.ts',
        output: [
            {
                name:      'InstabookEmbed',
                file:      'dist/instabook.umd.js',
                format:    'umd',
                exports:   'default',
                sourcemap: true,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // CommonJS bundle (only the Instabook Embed EmbedApi as default export).
    {
        input: 'src/EmbedApi.ts',
        output: [
            {
                name:      'InstabookEmbed',
                file:      'dist/instabook.cjs.js',
                format:    'cjs',
                exports:   'default',
                sourcemap: true,
            }
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // !!!
    // @deprecated - kept only for backwards compatibility and will be removed in v1.0.0
    // !!!
    //
    // Browser-friendly iife bundle (only the Instabook Embed EmbedApi as default export).
    {
        input: 'src/EmbedApi.ts',
        output: [
            {
                name:      'InstabookEmbed',
                file:      'dist/instabook.iife.js',
                format:    'iife',
                sourcemap: true,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

];
