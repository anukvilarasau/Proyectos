import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, registerables } from 'chart.js';
import App from './App';
import './styles/globals.css';

/* Register all Chart.js components globally */
Chart.register(...registerables);

/* Override Chart.js global defaults to match green-tech theme */
Chart.defaults.color              = '#3a7058';
Chart.defaults.borderColor        = 'rgba(0,255,135,0.07)';
Chart.defaults.font.family        = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size          = 11;
Chart.defaults.plugins.legend.labels.boxWidth    = 10;
Chart.defaults.plugins.legend.labels.padding     = 14;
Chart.defaults.plugins.legend.labels.color       = '#3a7058';
Chart.defaults.plugins.tooltip.backgroundColor   = 'rgba(4,16,9,0.95)';
Chart.defaults.plugins.tooltip.borderColor       = 'rgba(0,255,135,0.25)';
Chart.defaults.plugins.tooltip.borderWidth       = 1;
Chart.defaults.plugins.tooltip.titleColor        = '#00ff87';
Chart.defaults.plugins.tooltip.bodyColor         = '#b4f5d4';
Chart.defaults.plugins.tooltip.padding           = 10;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
