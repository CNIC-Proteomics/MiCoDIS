// Import libraries
import React from 'react';
import { createRoot } from 'react-dom/client';

// Import locals
import './index.css';
import App from './App';

// Render app
createRoot(
    document.getElementById('root')
    ).render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );