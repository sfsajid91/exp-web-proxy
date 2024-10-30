import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById(
    window.__uv$config.reactApp + 'root' || 'react-root'
);
const shadowRoot = root.shadowRoot;

createRoot(shadowRoot).render(
    <StrictMode>
        <App />
    </StrictMode>
);
