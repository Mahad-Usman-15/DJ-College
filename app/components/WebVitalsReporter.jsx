'use client';

import { useEffect } from 'react';

// Web Vitals reporting component
export default function WebVitalsReporter() {
  useEffect(() => {
    // Dynamically import web-vitals to keep it out of the main bundle
    const initWebVitals = async () => {
      try {
        // Import the web-vitals functions (note: newer versions use 'on' prefix instead of 'get')
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
        
        // Check if all required functions are available
        if (!onCLS || !onFCP || !onLCP || !onTTFB) {
          console.error('One or more Web Vitals functions are not available');
          return;
        }

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
        // Note: FID is now replaced by INP (Interaction to Next Paint) in newer versions
        onCLS(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
        
        // Optionally measure INP (Interaction to Next Paint) which replaces FID
        if (onINP) {
          onINP(sendToAnalytics);
        }
      } catch (error) {
        console.error('Failed to load web-vitals:', error);
      }
    };

    // Initialize Web Vitals regardless of environment for proper measurement
    // But only run in browser environment
    if (typeof window !== 'undefined') {
      initWebVitals();
    }
  }, []);

  return null; // This component doesn't render anything
}