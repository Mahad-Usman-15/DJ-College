'use client';

import { useEffect } from 'react';

// Web Vitals reporting component
export default function WebVitalsReporter() {
  useEffect(() => {
    // Dynamically import web-vitals to keep it out of the main bundle
    const initWebVitals = async () => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      // Send Web Vitals to analytics endpoint
      const sendToAnalytics = (metric) => {
        // Log to console for development
        console.log(`${metric.name}: ${metric.value}`);
        
        // In a real implementation, you would send this to your analytics service
        // For example: send to Google Analytics, or a custom endpoint
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value : metric.delta),
            event_label: metric.id,
            non_interaction: true,
          });
        }
        
        // You could also send to a custom endpoint for tracking
        // navigator.sendBeacon('/api/web-vitals', JSON.stringify(metric));
      };

      // Measure Core Web Vitals
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    };

    // Only initialize Web Vitals in production
    if (process.env.NODE_ENV === 'production') {
      initWebVitals().catch(error => {
        console.error('Failed to initialize Web Vitals:', error);
      });
    } else {
      // In development, we can still log for testing purposes
      console.log('Web Vitals reporting initialized (development mode)');
    }
  }, []);

  // Add a script to help search engines with dynamic content
  useEffect(() => {
    // Inform search engines that the page content is fully loaded
    if (typeof window !== 'undefined') {
      // This helps with dynamic content indexing
      const handleLoad = () => {
        // Indicate to search engines that dynamic content is loaded
        if (!window.location.hash) {
          window.location.hash = 'content-loaded';
          history.replaceState(null, null, window.location.pathname);
        }
      };

      // Check if the page is already loaded
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
      }

      // Cleanup event listener
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}