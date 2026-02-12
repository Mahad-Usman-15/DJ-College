// app/utils/web-vitals.js

// Function to instrument Web Vitals for SEO and performance monitoring
export function instrumentWebVitals() {
  if (typeof window !== 'undefined') {
    // Dynamically import web-vitals to keep it out of the main bundle
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
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
    }).catch(e => {
      console.error('Web vitals import failed:', e);
    });
  }
}

// Alternative approach using Next.js built-in function
export function reportWebVitals(metric) {
  // Log to console for development
  console.log(`${metric.id}: ${metric.name} - ${metric.value}`);

  // In a production environment, you would send these metrics to your analytics endpoint
  // For example, to Google Analytics or a custom logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to a custom endpoint
    // fetch('/api/web-vitals', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(metric),
    // }).catch(err => console.error('Failed to send web vital', err));
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value : metric.delta),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}