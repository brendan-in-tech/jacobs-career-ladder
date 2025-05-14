'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<{ message: string; action?: { text: string; href: string } } | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const getErrorMessage = (error: any) => {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    // Common Firebase Auth error codes
    switch (errorCode) {
      case 'auth/invalid-email':
        return {
          message: 'Please enter a valid email address.',
        };
      case 'auth/user-disabled':
        return {
          message: 'This account has been disabled.',
          action: {
            text: 'Contact support',
            href: '/support',
          },
        };
      case 'auth/user-not-found':
        return {
          message: 'No account found with this email.',
          action: {
            text: 'Sign up',
            href: '/signup',
          },
        };
      case 'auth/wrong-password':
        return {
          message: 'Incorrect password.',
          action: {
            text: 'Reset your password',
            href: '/reset-password',
          },
        };
      case 'auth/email-already-in-use':
        return {
          message: 'An account with this email already exists.',
          action: {
            text: 'Sign in instead',
            href: '/login',
          },
        };
      case 'auth/weak-password':
        return {
          message: 'Password is too weak. Please use a stronger password.',
        };
      case 'auth/too-many-requests':
        return {
          message: 'Too many failed attempts.',
          action: {
            text: 'Reset your password',
            href: '/reset-password',
          },
        };
      case 'auth/network-request-failed':
        return {
          message: 'Network error. Please check your internet connection and try again.',
        };
      case 'auth/popup-closed-by-user':
        return {
          message: 'Sign-in was cancelled.',
          action: {
            text: 'Try again',
            href: '#',
          },
        };
      case 'auth/popup-blocked':
        return {
          message: 'Pop-up was blocked.',
          action: {
            text: 'Allow pop-ups and try again',
            href: '#',
          },
        };
      case 'auth/cancelled-popup-request':
        return {
          message: 'Sign-in was cancelled.',
          action: {
            text: 'Try again',
            href: '#',
          },
        };
      case 'auth/account-exists-with-different-credential':
        return {
          message: 'An account already exists with this email using a different sign-in method.',
          action: {
            text: 'Try a different sign-in method',
            href: '/login',
          },
        };
      default:
        // If it's a custom error message, return it
        if (errorMessage && !errorMessage.includes('Firebase:')) {
          return { message: errorMessage };
        }
        // Generic error message for unknown errors
        return {
          message: 'An error occurred during sign-in.',
          action: {
            text: 'Try again',
            href: '#',
          },
        };
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    try {
      await signIn(email, password, rememberMe);
      router.push('/dashboard');
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle(rememberMe);
      router.push('/dashboard');
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
      e.preventDefault();
      // Clear error and retry the last action
      setError(null);
      if (isGoogleLoading) {
        handleGoogleLogin();
      } else {
        handleEmailLogin(e as any);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-bold text-blue-600 mb-2">
            Jacob's Ladder
          </h1>
          <h2 className="mt-2 text-center text-xl text-gray-600">
            Climb your way to success
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.message}
                    {error.action && (
                      <>
                        {' '}
                        <Link
                          href={error.action.href}
                          onClick={(e) => handleActionClick(e, error.action!.href)}
                          className="font-medium text-red-700 hover:text-red-600 underline focus:outline-none focus:underline transition ease-in-out duration-150"
                        >
                          {error.action.text}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailLoading || isGoogleLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isEmailLoading || isGoogleLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isEmailLoading || isGoogleLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isEmailLoading || isGoogleLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmailLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isEmailLoading || isGoogleLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      fill="#4285F4"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 