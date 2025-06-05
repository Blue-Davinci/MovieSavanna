import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: { 
        adapter: adapter(),
        
        // TodO: Change!!! [CONDITIONAL: Only check CSRF in production]
        csrf: {
            checkOrigin: process.env.NODE_ENV === 'production'
        }
    }
};

export default config;