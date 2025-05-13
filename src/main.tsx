import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { HeroUIProvider } from '@heroui/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </StrictMode>,
)
