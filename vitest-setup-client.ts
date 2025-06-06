import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock environment variables
vi.mock('$env/static/private', () => ({
	SUPABASE_URL: 'https://test.supabase.co',
	SUPABASE_ANON_KEY: 'test-anon-key',
	TMDB_API_KEY: 'test-tmdb-key'
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
	PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
}));

// Mock logger
vi.mock('$lib/helpers/logger/logger.js', () => ({
	logInfo: vi.fn(),
	logError: vi.fn(),
	logWarn: vi.fn()
}));

// Mock Supabase client
vi.mock('$lib/helpers/auth/supabaseClient.js', () => ({
	createSupabaseServerClient: vi.fn(),
	createSupabaseClient: vi.fn()
}));
