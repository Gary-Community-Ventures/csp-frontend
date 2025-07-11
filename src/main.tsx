import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routes/router'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Function to generate a random OKLCH color
const getRandomOklchColor = () => {
  const l = Math.random() * (0.9 - 0.2) + 0.2; // Lightness between 20% and 90%
  const c = Math.random() * (0.2 - 0.05) + 0.05; // Chroma between 5% and 20%
  const h = Math.random() * 360; // Hue between 0 and 360
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

function App() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', getRandomOklchColor());
    root.style.setProperty('--primary-foreground', getRandomOklchColor());
    root.style.setProperty('--secondary', getRandomOklchColor());
    root.style.setProperty('--secondary-foreground', getRandomOklchColor());
  }, []);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}