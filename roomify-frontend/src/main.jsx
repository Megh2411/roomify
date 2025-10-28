import React from 'react' // Import React if not already
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider.jsx' // <-- 1. Import ThemeProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- 2. Wrap App with ThemeProvider --- */}
    <ThemeProvider defaultTheme="system" storageKey="roomify-theme"> 
      <App />
    </ThemeProvider>
    {/* ------------------------------------- */}
  </React.StrictMode>,
)