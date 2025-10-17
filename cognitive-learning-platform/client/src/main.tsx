// --- START OF FILE client/src/main.tsx ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './globals.css';

// Get the root element from the DOM.
const rootElement = document.getElementById('root') as HTMLElement | null;

// Ensure the root element exists before trying to render into it.
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App as unknown as React.ComponentType, null)
    )
  );
} else {
  console.error("Failed to find the root element. Make sure your index.html has an element with id='root'.");
}
// --- END OF FILE client/src/main.tsx ---