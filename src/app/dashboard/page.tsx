'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Package, Download, ChevronRight, Eye, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  downloadUrl: string;
}

export default function DashboardPage() {
  const { isAuthenticated, logout, firstName, hasSeenWelcome, markWelcomeAsSeen } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Dashboard: Not authenticated, redirecting to login...');
      setIsLoadingProducts(false);
      router.push('/');
      return;
    }
    console.log('Dashboard: Authenticated, fetching products...');
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error! status: ${response.status}, message: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        console.log('Dashboard: Products fetched successfully.');
        setProducts(data);
      } catch (e: any) {
        console.error("Dashboard: Failed to fetch products:", e);
        setError(`Failed to load product library: ${e.message}`);
      } finally {
        console.log('Dashboard: fetchProducts finished, setting isLoadingProducts to false.');
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const shouldShow = firstName && !isLoadingProducts && !hasSeenWelcome;
    if (shouldShow) {
      console.log('Dashboard Effect: Conditions met, setting isOverlayVisible to true');
      setIsOverlayVisible(true);
    } else {
      console.log(`Dashboard Effect: Conditions NOT met (firstName: ${!!firstName}, !isLoadingProducts: ${!isLoadingProducts}, !hasSeenWelcome: ${!hasSeenWelcome}), setting isOverlayVisible to false`);
      setIsOverlayVisible(false);
    }
  }, [firstName, isLoadingProducts, hasSeenWelcome]);

  if (isLoadingProducts && !isOverlayVisible) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue">
        <p className="text-text_color-muted text-lg animate-pulse">Initializing Library...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoadingProducts) {
    console.warn('Dashboard: Rendering null because not authenticated (should have redirected).');
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue text-text_color">

      {isOverlayVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-card rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full text-center transform transition-all scale-100 opacity-100">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text_color">Welcome, {firstName || 'User'}!</h2>
            <p className="text-text_color-muted mb-8">Your digital library awaits.</p>
            <button
              onClick={markWelcomeAsSeen}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-background-card"
            >
              Enter Library
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`transition-filter duration-300 ease-in-out p-8 md:p-12 ${isOverlayVisible ? 'blur-sm pointer-events-none' : 'blur-none pointer-events-auto'}`}
      >
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-border_color/30 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center mb-4 md:mb-0">
            <Package className="mr-3 h-8 w-8 text-brand-blue" />
            Your Digital Library
          </h1>
          <button
            onClick={logout}
            className="flex items-center px-5 py-2.5 bg-background-alt hover:bg-border_color rounded-lg text-sm font-medium transition duration-200 ease-in-out border border-border_color shadow-sm hover:shadow-md"
          >
            <LogOut className="mr-2 h-4 w-4 text-text_color-muted" /> Secure Logout
          </button>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-brand-red/10 border border-brand-red/30 rounded-lg text-center">
            <p className="text-brand-red font-medium">{error}</p>
          </div>
        )}

        {!error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <Link href={`/products/${product.id}`} key={product.id} legacyBehavior>
                    <a className="group block bg-background-card rounded-xl shadow-lg overflow-hidden border border-border_color hover:border-brand-blue/50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                      <div className="h-52 bg-background-alt flex items-center justify-center border-b border-border_color relative overflow-hidden">
                        <Image 
                          src={product.imageUrl} 
                          alt={`Image for ${product.name}`}
                          fill 
                          style={{ 
                            objectFit: 'cover', 
                            objectPosition: 'center 25%' 
                          }}
                          className="transition-transform duration-300 group-hover:scale-105"
                          priority={index < 3} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 truncate group-hover:text-brand-blue transition-colors duration-200">{product.name}</h3>
                        <p className="text-text_color-muted text-sm mb-5 line-clamp-2">{product.description}</p>
                        <span className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-border_color text-sm font-medium rounded-lg text-text_color bg-background-alt group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition duration-200 ease-in-out">
                          Access Product
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              !isLoadingProducts && !isOverlayVisible && (
                <div className="text-center py-10">
                  <p className="text-text_color-muted">Your library is currently empty.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
