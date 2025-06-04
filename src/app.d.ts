// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
	interface Locals {
      user: User | null;
      isAuthenticated: boolean;
      isAdmin: boolean;
      isVerified: boolean;
    }
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
