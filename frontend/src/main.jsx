import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import "./i18n";
import App from './App.jsx'
import "./tailwind.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
