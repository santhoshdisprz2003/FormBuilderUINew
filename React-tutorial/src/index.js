// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // You can add global styles here
import App from './App';
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
