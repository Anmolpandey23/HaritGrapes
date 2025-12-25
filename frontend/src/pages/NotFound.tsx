import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="text-center flex flex-col items-center gap-3">
      <span className="text-7xl drop-shadow text-grape">😢</span>
      <h1 className="text-4xl font-bold text-primary mb-2">404: Page Not Found</h1>
      <p className="mb-3 text-gray-700">Sorry, we couldn’t find that page!</p>
      <Link to="/" className="px-6 py-3 rounded bg-primary text-accent font-bold">
        Go Home
      </Link>
    </div>
  </main>
);

export default NotFound;
