import React from 'react';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <AppRouter />
    <Toaster position="top-right" />
  </div>
);

export default App;
