import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            // Vercel adapter options
            runtime: 'nodejs20.x',
            memory: 1024,
            maxDuration: 10
        }),

        // CSRF protection enabled for production
        csrf: {
            checkOrigin: process.env.NODE_ENV === 'production'
        },

        // Environment variable configuration
        env: {
            publicPrefix: 'PUBLIC_',
            privatePrefix: ''
        }
    }
};

export default config;