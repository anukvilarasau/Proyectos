import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, registerables } from 'chart.js';
import App from './App';
import './styles/globals.css';

Chart.register(...registerables);

/* Global Chart.js theme — dark navy */
Chart.defaults.color              = '#505070';
Chart.defaults.borderColor        = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family        = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size          = 11;
Chart.defaults.plugins.legend.labels.boxWidth  = 10;
Chart.defaults.plugins.legend.labels.padding   = 14;
Chart.defaults.plugins.legend.labels.color     = '#505070';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10,10,30,0.96)';
Chart.defaults.plugins.tooltip.borderColor     = 'rgba(124,79,255,0.30)';
Chart.defaults.plugins.tooltip.borderWidth     = 1;
Chart.defaults.plugins.tooltip.titleColor      = '#7c4fff';
Chart.defaults.plugins.tooltip.bodyColor       = '#c8c8e8';
Chart.defaults.plugins.tooltip.padding         = 10;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
