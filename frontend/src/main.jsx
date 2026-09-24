import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { IsaiProvider } from './context/IsaiContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IsaiProvider>
          <App />
        </IsaiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
