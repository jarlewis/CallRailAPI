import React from 'react';
import ReactDOM from 'react-dom/client';
import CallrailListAccountsDashboard from './CallrailListAccountsDashboard';
import './styles.css';

// Add this line to include Tailwind's base styles
import 'tailwindcss/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CallrailListAccountsDashboard />
  </React.StrictMode>
);