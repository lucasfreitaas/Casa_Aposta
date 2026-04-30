import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#111',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          padding: '14px 18px',
        },
        success: {
          iconTheme: { primary: '#7c3aed', secondary: '#fff' },
        },
      }}
    />
  </React.StrictMode>
)
