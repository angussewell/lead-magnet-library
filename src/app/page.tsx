'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

// Minimum time in milliseconds to show loading state on failure
const MIN_LOADING_TIME_ON_FAILURE = 10000; // 10 seconds

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const startTime = Date.now(); // Record start time

    let success = false;
    let caughtError = null;

    try {
      success = await login(email, password);
      // On success, the login function in AuthContext handles redirection
      // We don't need to add delay on success
    } catch (err) {
      // Catch unexpected errors from the login promise
      console.error("Login page submission error:", err);
      caughtError = err; // Store error to handle after potential delay
    } finally {
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      // If login failed (either !success or caughtError) and elapsed time is less than minimum
      if ((!success || caughtError) && elapsedTime < MIN_LOADING_TIME_ON_FAILURE) {
        const remainingTime = MIN_LOADING_TIME_ON_FAILURE - elapsedTime;
        console.log(`Login failed/error in ${elapsedTime}ms. Waiting additional ${remainingTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      // Now set the error message if login failed or an error was caught
      if (!success) {
        if (caughtError) {
          setError('An unexpected error occurred. Please try again later.');
        } else {
          setError('Authentication failed. Please verify your credentials or try again.');
        }
      }
      
      // Always set loading to false after handling everything
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue text-text_color">
      <div className="w-full max-w-md p-10 space-y-8 bg-background-alt rounded-2xl shadow-2xl border border-border_color">
        <div className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-brand-blue mb-4" />
          <h2 className="text-3xl font-bold tracking-tight">
            Access Your Portal
          </h2>
          <p className="mt-2 text-sm text-text_color-muted">
            Enter your credentials to manage your assets.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <fieldset disabled={isLoading} className="space-y-4">
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
                className="appearance-none relative block w-full px-4 py-3 border border-border_color bg-background placeholder-text_color-muted text-text_color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm transition duration-150 ease-in-out disabled:opacity-50"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="appearance-none relative block w-full px-4 py-3 border border-border_color bg-background placeholder-text_color-muted text-text_color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm transition duration-150 ease-in-out disabled:opacity-50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-brand-red text-center font-medium">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-brand-red hover:bg-brand-red_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-alt focus:ring-brand-red transition duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Authenticating...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
