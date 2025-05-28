// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind CSS + custom styles
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> {/* Optional: StrictMode for development checks */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);