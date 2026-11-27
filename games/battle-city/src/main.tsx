import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../../styles/tokens.css';
import '../../../styles/game-ui.css';
import './style.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
