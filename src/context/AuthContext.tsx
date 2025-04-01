'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of the successful response
interface AuthSuccessResponse {
  success: true;
  firstName: string;
}

// Define the shape of a failed response (if status is 200)
interface AuthFailureResponse {
  success: false;
  message?: string; 
}

type AuthResponse = AuthSuccessResponse | AuthFailureResponse;

interface AuthContextType {
  isAuthenticated: boolean;
  firstName: string | null; 
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  hasSeenWelcome: boolean; 
  markWelcomeAsSeen: () => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_WEBHOOK_URL = 'https://n8n.srv768302.hstgr.cloud/webhook/lead-magnet-auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null); 
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false); 
  const router = useRouter();

  const login = async (email: string, pass: string): Promise<boolean> => {
    console.log(`Attempting login for ${email} via webhook...`);
    setFirstName(null); 
    setIsAuthenticated(false);
    setHasSeenWelcome(false); 

    try {
      const response = await fetch(AUTH_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: pass }),
      });

      // Handle non-2xx responses (e.g., 401 Unauthorized, 500 Server Error)
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Failed to read error body');
        console.error('Webhook authentication failed (non-2xx status):', response.status, errorText);
        return false;
      }

      // Handle 2xx responses - expecting JSON now
      try {
        // Expecting a direct object response based on latest console logs
        const data: AuthResponse = await response.json(); 

        // Validate the structure and content of the object
        if (data.success === true && data.firstName) {
          // Authentication successful
          console.log('Webhook authentication successful. Welcome,', data.firstName);
          setIsAuthenticated(true);
          setFirstName(data.firstName); 
          router.push('/dashboard');
          return true;
        } else {
          // Handle cases where response is { success: false } or missing firstName
          // Also handles cases where the structure is wrong but parseable as JSON
          console.warn('Webhook authentication failed (success: false or unexpected object structure):', 
                       (data as AuthFailureResponse).message || JSON.stringify(data)); // Log message or full object
          return false;
        }

      } catch (jsonError) {
        // Handle cases where response is 2xx but not valid JSON 
        console.error('Webhook response could not be parsed as JSON:', jsonError);
        // Try to log the raw text for debugging
        try {
          const rawText = await response.text();
          console.error('Raw response body:', rawText);
        } catch (textError) {
          console.error('Failed to read response body as text after JSON parse failure.');
        }
        return false;
      }

    } catch (error) {
      // Handle network errors or other issues with the fetch call itself
      console.error('Error during webhook fetch call:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setFirstName(null); 
    setHasSeenWelcome(false); 
    console.log('Logged out, redirecting to /');
    router.push('/');
  };

  const markWelcomeAsSeen = () => { 
     console.log('Marking welcome as seen.');
     setHasSeenWelcome(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, firstName, login, logout, hasSeenWelcome, markWelcomeAsSeen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
