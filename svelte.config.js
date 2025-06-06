import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),

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
