import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EntriesPage } from './EntriesPage.jsx'
import App from './App'
'./EntriesPage.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
