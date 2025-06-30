import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import './index.css';

// Import MSW for API mocking
import { worker } from './mocks/browser';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Create a client
const queryClient = new QueryClient();

// Function to clean up problematic cookies that might cause MSW issues
function clearProblematicCookies() {
  try {
    // Get all cookies and check for invalid names
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name] = cookie.trim().split('=');
      // Check if cookie name contains invalid characters
      if (name && !/^[a-zA-Z0-9_-]+$/.test(name)) {
        // Try to delete invalid cookies
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      }
    }
  } catch (error) {
    console.warn('Failed to clean cookies:', error);
  }
}

// Function to initialize the app
async function enableMocking() {
  // Only enable in development mode
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    try {
      // Clean problematic cookies before starting MSW
      clearProblematicCookies();
      
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
      });
    } catch (error) {
      console.warn('MSW failed to start:', error);
      // Continue without MSW if it fails
    }
  }
}

// Initialize MSW and then start the app
enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StrictMode>
    );
  }
});