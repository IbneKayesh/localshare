import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-purple/theme.css";
import "primeflex/primeflex.css"
import "primeflex/themes/primeone-light.css"

import "primeicons/primeicons.css";

import { PrimeReactProvider } from 'primereact/api';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
  </StrictMode>,
)
