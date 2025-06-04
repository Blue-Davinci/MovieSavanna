import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { enhancedLoginSchema } from '$lib/schemas/schema';
import { fail, type RequestEvent } from '@sveltejs/kit';

export const load = async () => {
  const form = await superValidate(zod(enhancedLoginSchema));
  return { form };
};

export const actions = {
  default: async (event: RequestEvent) => {
    const { request } = event;
    const form = await superValidate(request, zod(enhancedLoginSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    try {
      // Simulate authentication logic - replace with your actual auth
      const { email, password, rememberMe } = form.data;
      
      console.log('Login attempt:', { email, rememberMe });
      
      // Mock authentication (replace with your actual auth service)
      if (email === 'demo@moviesavanna.com' && password === 'Demo123!') {
        // Success case
        return {
          form,
          message: {
            success: true,
            message: 'Login successful!',
            data: {
              first_name: 'Demo',
              last_name: 'User'
            }
          }
        };
      } else if (email === 'inactive@moviesavanna.com') {
        // Activation required case
        return {
          form,
          message: {
            success: false,
            message: 'activation_required'
          }
        };
      } else if (email === 'mfa@moviesavanna.com') {
        // MFA required case
        return {
          form,
          message: {
            success: false,
            message: 'mfa_required',
            email: email,
            token: 'mock-mfa-token-123'
          }
        };
      } else {
        // Invalid credentials
        return {
          form,
          message: {
            success: false,
            message: 'Invalid email or password'
          }
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return fail(500, {
        form,
        message: {
          success: false,
          message: 'An error occurred during login'
        }
      });
    }
  }
};