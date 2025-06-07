import { z } from 'zod';

export const enhancedLoginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address')
		.max(255, 'Email must not exceed 255 characters')
		.toLowerCase()
		.trim(),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password must not exceed 100 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		),
	rememberMe: z.boolean().default(false)
});

export const signupSchema = z
	.object({
		firstName: z
			.string()
			.min(1, 'First name is required')
			.min(2, 'First name must be at least 2 characters')
			.max(50, 'First name must not exceed 50 characters')
			.trim(),
		lastName: z
			.string()
			.min(1, 'Last name is required')
			.min(2, 'Last name must be at least 2 characters')
			.max(50, 'Last name must not exceed 50 characters')
			.trim(),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Please enter a valid email address')
			.max(255, 'Email must not exceed 255 characters')
			.toLowerCase()
			.trim(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must not exceed 100 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		phone: z
			.string()
			.optional()
			.refine((phone) => {
				if (!phone || phone.trim() === '') return true; // Optional field
				return /^\+?[\d\s\-()]{10,15}$/.test(phone.trim());
			}, 'Please enter a valid phone number'),
		termsAccepted: z
			.boolean()
			.refine((val) => val === true, 'You must accept the terms and conditions')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type EnhancedLoginForm = z.infer<typeof enhancedLoginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;

// Account activation schema
export const activationSchema = z.object({
	code: z
		.string()
		.min(1, 'Activation code is required')
		.min(8, 'Invalid activation code format')
		.transform((val) => val.trim())
});

export type ActivationForm = z.infer<typeof activationSchema>;
