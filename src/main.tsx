import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import IdeasProvider from './components/ideas-context.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <IdeasProvider>
            <App />
        </IdeasProvider>
    </StrictMode>
)
