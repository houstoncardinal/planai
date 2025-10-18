'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

import {
	AppleIcon,
	AtSignIcon,
	ChevronLeftIcon,
	GithubIcon,
	Grid2x2PlusIcon,
	Loader2,
} from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function AuthPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswordField, setShowPasswordField] = useState(false);
	const [isExistingUser, setIsExistingUser] = useState(false);

	const checkUserExists = async (email: string) => {
		try {
			// Try to sign in with a dummy password to check if user exists
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password: 'dummy-check-password-that-will-fail',
			});

			// If error is "Invalid login credentials", user exists but password is wrong
			// If error is "Email not confirmed", user exists
			// If error is something else, user might not exist
			if (error) {
				if (error.message.includes('Invalid login credentials') || 
				    error.message.includes('Email not confirmed')) {
					return true; // User exists
				}
			}
			return false; // User doesn't exist
		} catch (error) {
			return false;
		}
	};

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		
		setIsLoading(true);
		try {
			const userExists = await checkUserExists(email);
			
			if (userExists) {
				// User exists, show password field
				setIsExistingUser(true);
				setShowPasswordField(true);
				toast.info('Please enter your password');
			} else {
				// New user, send magic link
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/`,
					},
				});

				if (error) {
					toast.error(error.message);
				} else {
					toast.success('Check your email for the login link!');
					setEmail('');
				}
			}
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) return;
		
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast.error(error.message);
			} else {
				toast.success('Welcome back!');
			}
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToEmail = () => {
		setShowPasswordField(false);
		setIsExistingUser(false);
		setPassword('');
	};

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});
			if (error) toast.error(error.message);
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAppleAuth = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'apple',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});
			if (error) toast.error(error.message);
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handleGithubAuth = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});
			if (error) toast.error(error.message);
		} catch (error) {
			toast.error('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 dark bg-black">
			<div className="bg-black/60 relative hidden h-full flex-col border-r border-slate-800 p-10 lg:flex dark">
				<div className="from-black absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center">
					<motion.h1 
						className="text-3xl font-semibold tracking-wide relative"
						style={{ 
							fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
							background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%)',
							backgroundSize: '200% 100%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3)) drop-shadow(0 2px 8px rgba(255, 255, 255, 0.1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
						}}
						animate={{
							backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							ease: 'linear',
						}}
					>
						Plan.AI
					</motion.h1>
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl text-white">
							&ldquo;Plan.AI transformed how we build software. The AI-powered insights and intelligent planning tools have accelerated our development cycle by 3x.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold text-slate-300">
							~ Sarah Chen, CTO at TechVentures
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4 bg-black dark">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(59,130,246,0.15)_0,rgba(59,130,246,0.05)_50%,rgba(59,130,246,0.02)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(139,92,246,0.15)_0,rgba(139,92,246,0.05)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.15)_0,rgba(59,130,246,0.05)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>
				<Button variant="ghost" className="absolute top-7 left-5 text-slate-300 hover:text-white hover:bg-slate-800" asChild>
					<a href="#">
						<ChevronLeftIcon className='size-4 me-2' />
						Home
					</a>
				</Button>
				<div className="mx-auto space-y-4 sm:w-sm">
					<div className="flex items-center lg:hidden">
						<motion.h1 
							className="text-2xl font-semibold tracking-wide relative"
							style={{ 
								fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
								background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%)',
								backgroundSize: '200% 100%',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3)) drop-shadow(0 2px 8px rgba(255, 255, 255, 0.1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
							}}
							animate={{
								backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: 'linear',
							}}
						>
							Plan.AI
						</motion.h1>
					</div>
					<div className="flex flex-col space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-wide text-white">
							Welcome to Plan.AI
						</h1>
						<p className="text-slate-400 text-base">
							Your intelligent partner in software development planning and execution.
						</p>
					</div>
					<div className="space-y-2">
						<Button 
							type="button" 
							size="lg" 
							className="w-full bg-white hover:bg-gray-100 text-slate-900 shadow-lg hover:shadow-xl transition-all"
							onClick={handleGoogleAuth}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="size-4 me-2 animate-spin" />
							) : (
								<GoogleIcon className='size-4 me-2' />
							)}
							Continue with Google
						</Button>
						<Button 
							type="button" 
							size="lg" 
							className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-lg hover:shadow-xl transition-all"
							onClick={handleAppleAuth}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="size-4 me-2 animate-spin" />
							) : (
								<AppleIcon className='size-4 me-2' />
							)}
							Continue with Apple
						</Button>
						<Button 
							type="button" 
							size="lg" 
							className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-lg hover:shadow-xl transition-all"
							onClick={handleGithubAuth}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="size-4 me-2 animate-spin" />
							) : (
								<GithubIcon className='size-4 me-2' />
							)}
							Continue with GitHub
						</Button>
					</div>

					<AuthSeparator />

					{!showPasswordField ? (
						<form className="space-y-2" onSubmit={handleEmailSubmit}>
							<p className="text-slate-400 text-start text-xs">
								Enter your email address to sign in or create an account
							</p>
							<div className="relative h-max">
								<Input
									placeholder="your.email@example.com"
									className="peer ps-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
									required
								/>
								<div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<AtSignIcon className="size-4" aria-hidden="true" />
								</div>
							</div>

							<Button 
								type="submit" 
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="size-4 me-2 animate-spin" />
										<span>Checking...</span>
									</>
								) : (
									<span>Continue With Email</span>
								)}
							</Button>
						</form>
					) : (
						<form className="space-y-2" onSubmit={handlePasswordSignIn}>
							<div className="flex items-center justify-between mb-2">
								<p className="text-slate-400 text-start text-xs">
									Welcome back! Enter your password
								</p>
								<button
									type="button"
									onClick={handleBackToEmail}
									className="text-green-400 hover:text-green-300 text-xs underline"
								>
									Change email
								</button>
							</div>
							<div className="relative h-max">
								<Input
									placeholder={email}
									className="bg-slate-900 border-slate-700 text-slate-500"
									type="email"
									value={email}
									disabled
								/>
							</div>
							<div className="relative h-max">
								<Input
									placeholder="Enter your password"
									className="peer bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
									required
									autoFocus
								/>
							</div>

							<Button 
								type="submit" 
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="size-4 me-2 animate-spin" />
										<span>Signing in...</span>
									</>
								) : (
									<span>Sign In</span>
								)}
							</Button>
							<button
								type="button"
								onClick={() => {
									// Send password reset email
									supabase.auth.resetPasswordForEmail(email, {
										redirectTo: `${window.location.origin}/`,
									});
									toast.success('Password reset link sent to your email!');
								}}
								className="text-slate-400 hover:text-green-400 text-xs w-full text-center mt-2"
							>
								Forgot password?
							</button>
						</form>
					)}
					<p className="text-slate-400 mt-8 text-sm">
						By clicking continue, you agree to our{' '}
						<a
							href="#"
							className="text-green-400 hover:text-green-300 underline underline-offset-4"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="text-green-400 hover:text-green-300 underline underline-offset-4"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-white"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="bg-slate-700 h-px w-full" />
			<span className="text-slate-400 px-2 text-xs">OR</span>
			<div className="bg-slate-700 h-px w-full" />
		</div>
	);
};
