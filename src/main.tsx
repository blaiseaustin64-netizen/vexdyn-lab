import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LabProgressProvider } from './hooks/useLabProgress';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LabProgressProvider>
        <App />
      </LabProgressProvider>
    </BrowserRouter>
  </StrictMode>
);
