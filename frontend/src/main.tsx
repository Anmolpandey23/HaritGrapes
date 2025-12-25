import React from 'react';
import "./i18n";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LanguageSync from './LanguageSync'; // <-- Import the sync component you created!
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageSync />   {/* This ensures the language is set from Firestore profile */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
