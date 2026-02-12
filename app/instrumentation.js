// app/instrumentation.js
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import the web-vitals function
    const { instrumentWebVitals } = await import('./utils/web-vitals');
    instrumentWebVitals();
  }
}