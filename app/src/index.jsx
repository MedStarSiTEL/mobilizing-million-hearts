import React from 'react';
import { createRoot } from 'react-dom/client';

// Import CSS files
import './resources/cerner-smart-embeddable-lib-1.2.0.min.js';
import './resources/cerner-smart-embeddable-lib-1.2.0.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'rc-slider/assets/index.css';
import './index.css';

import App from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
