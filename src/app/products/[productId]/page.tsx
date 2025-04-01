'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Download, PlayCircle, Package, AlertTriangle } from 'lucide-react'; 

// Shared Product type
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  downloadUrl: string;
  details?: string;
  videoUrl?: string;
}

export default function ProductDetailPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login...');
      router.push('/');
      return;
    }

    const fetchProductDetails = async () => {
      if (!productId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error! status: ${response.status}, message: ${errorText || response.statusText}`);
        }
        const products: Product[] = await response.json();
        const foundProduct = products.find(p => p.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Asset not found in your library.');
        }
      } catch (e: any) {
        console.error("Failed to fetch product details:", e);
        setError(`Error retrieving asset details: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();

  }, [isAuthenticated, router, productId]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue">
        <p className="text-text_color-muted text-lg animate-pulse">Loading Asset Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue text-text_color p-8">
        <AlertTriangle className="w-12 h-12 text-brand-red mb-4" />
        <p className="text-brand-red mb-6 text-center font-medium">{error}</p>
        <Link href="/dashboard" legacyBehavior>
          <a className="inline-flex items-center px-5 py-2.5 bg-brand-blue hover:bg-brand-blue_dark rounded-lg text-sm font-medium text-white transition duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Library
          </a>
        </Link>
      </div>
    );
  }

  if (!product) {
    // This case should ideally be caught by the error state, but added as a fallback
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue">
        <p className="text-text_color-muted">Asset information unavailable.</p>
      </div>
    );
  }

  // Enhanced Product Detail Layout
  return (
    <div className="min-h-screen bg-gradient-cool-bl from-gradient-cool_deep_blue via-gradient-cool_mid_blue to-gradient-cool_light_blue text-text_color p-8 md:p-12">
      {/* Back Navigation */}
      <div className="mb-10">
        <Link href="/dashboard" legacyBehavior>
          <a className="inline-flex items-center text-brand-blue hover:text-brand-blue_dark transition duration-150 ease-in-out font-medium">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Library
          </a>
        </Link>
      </div>

      {/* Product Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Left Column: Image/Placeholder & Download (Takes 2 cols on lg) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background-card rounded-xl shadow-lg overflow-hidden border border-border_color">
             {/* Use Next/Image instead of placeholder */}
             <div className="relative aspect-square"> 
               <Image
                  src={product.imageUrl}
                  alt={`Image for ${product.name}`}
                  fill 
                  style={{ objectFit: 'cover' }} 
                  priority 
                  className="bg-background-alt" 
                />
             </div>
          </div>
          <a 
            href={product.downloadUrl} 
            download
            // Enhanced Download Button using brand red
            className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-brand-red hover:bg-brand-red_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-red transition duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download className="mr-3 h-6 w-6" />
            Download Asset
          </a>
        </div>

        {/* Right Column: Details & Video (Takes 3 cols on lg) */}
        <div className="lg:col-span-3 space-y-10">
          {/* Using text gradient for title */}
          <h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-red via-gradient_warm-bright_red to-gradient_warm-gold text-transparent bg-clip-text pb-1" 
            data-component-name="ProductDetailPage"
          >
            {product.name}
          </h1>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border_color/30 pb-3">Overview</h2>
            <p className="text-text_color-muted leading-relaxed text-base md:text-lg">{product.description}</p>
          </div>

          {product.details && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold border-b border-border_color/30 pb-3">Specifications & Setup</h2>
              <div className="prose prose-invert max-w-none text-text_color-muted prose-headings:text-text_color prose-a:text-brand-blue hover:prose-a:text-brand-blue_dark">
                 {/* Consider using react-markdown here for rich text */}
                 <p className="whitespace-pre-wrap">{product.details}</p> 
              </div>
            </div>
          )}

          {product.videoUrl && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold border-b border-border_color/30 pb-3 flex items-center">
                <PlayCircle className="mr-3 h-6 w-6 text-brand-blue" /> Guidance
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-border_color bg-background-alt">
                <iframe 
                  src={product.videoUrl} 
                  title={`${product.name} Guidance Video`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
