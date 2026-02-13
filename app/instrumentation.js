// app/instrumentation.js
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation can go here if needed
    // Currently empty as web vitals are handled client-side
  }
}