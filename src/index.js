import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { ClerkProvider } from '@clerk/clerk-react'
import './App.css';



const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.log("Key ist leider noch undefined!");
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)