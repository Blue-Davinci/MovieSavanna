import type { RequestEvent } from '@sveltejs/kit';

interface UserInformation {
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    isVerified?: boolean;
    user?: string; // Replace with your actual user type
}

export const load = async ({ locals }: Pick<RequestEvent, 'locals'>) => {
    const userInformation: UserInformation = {
        isAuthenticated: locals.isAuthenticated,
        isAdmin: locals.isAdmin,
        isVerified: locals.isVerified,
        user: locals.user.email || '',
    };
    
    return {
        userInformation
    };
};