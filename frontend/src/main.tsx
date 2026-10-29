import React from 'react';
import "./i18n";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LanguageSync from './LanguageSync';
import { initRealtimeTranslate } from './utils/realtimeTranslate';
import './index.css';

// Initialize Realtime Multi-Language Engine (English default, Hindi, Marathi)
initRealtimeTranslate();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageSync />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

