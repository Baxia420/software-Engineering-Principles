import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing! Check your .env file or Vercel environment variables.");
  alert("CRITICAL CONFIGURATION ERROR:\n\n'VITE_SUPABASE_URL' or 'VITE_SUPABASE_ANON_KEY' environment variables are missing!\n\n• If running locally: Please restart your development server (Ctrl+C and run 'npm run dev' again) to load the new .env file.\n• If running on Vercel: Please add these variables in your Vercel Project Settings and re-deploy.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
