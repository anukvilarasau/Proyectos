import { Bar } from 'react-chartjs-2';
import Panel from '../ui/Panel';
import { HOURS } from '../../utils/mockData';
import styles from './Alerts.module.css';

const animation = { animation: false, responsive: true, maintainAspectRatio: false };
const baseScale = { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#505070' } };

const THRESHOLDS = [
  { label: 'Temperatura Máxima',      value: 50,  max: 100, unit: '°C',  color: '#ff3d6b' },
  { label: 'Temperatura Mínima',      value: 18,  max: 40,  unit: '°C',  color: '#00e5b3' },
  { label: 'Humedad Máxima',          value: 80,  max: 100, unit: '%',   color: '#7c4fff' },
  { label: 'Consumo Umbral',          value: 200, max: 400, unit: 'kWh', color: '#ffd600' },
  { label: 'Inyección Máx. a Red',    value: 150, max: 300, unit: 'kWh', color: '#aaff3e' },
  { label: 'OEE Mínimo',              value: 75,  max: 100, unit: '%',   color: '#00ff80' },
];

const TYPE_ICON = { critical: '🔴', warning: '🟡', info: '🟢' };

const alertVol = HOURS.map(() => ({
  critical: Math.floor(Math.random() * 5),
  warning:  Math.floor(Math.random() * 10),
  info:     Math.floor(Math.random() * 15),
}));

export default function Alerts({ alerts, clearAlerts }) {
  const counts = alerts.reduce(
    (acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; },
    { critical: 0, warning: 0, info: 0 }
  );

  return (
    <div className={styles.root}>

      {/* ── Count strip ── */}
      <div className={styles.countStrip}>
        <div className={styles.countItem}>
          <span className={styles.countVal} style={{ color: 'var(--red)' }}>{counts.critical}</span>
          <span className={styles.countLabel}>Críticas</span>
        </div>
        <div className={styles.countDivider} />
        <div className={styles.countItem}>
          <span className={styles.countVal} style={{ color: 'var(--amber)' }}>{counts.warning}</span>
          <span className={styles.countLabel}>Avisos</span>
        </div>
        <div className={styles.countDivider} />
        <div className={styles.countItem}>
          <span className={styles.countVal} style={{ color: 'var(--neon)' }}>{counts.info}</span>
          <span className={styles.countLabel}>Info</span>
        </div>
        <div className={styles.countDivider} />
        <div className={styles.countItem}>
          <span className={styles.countVal} style={{ color: 'var(--teal)' }}>{alerts.length}</span>
          <span className={styles.countLabel}>Total</span>
        </div>
      </div>

      {/* ── Feed + Volume ── */}
      <div className={styles.row2}>
        <Panel
          title="Feed de Alertas — Tiempo Real"
          icon="◎"
          headerRight={
            <button className={styles.clearBtn} onClick={clearAlerts}>
              Limpiar
            </button>
          }
        >
          <div className={styles.feed}>
            {alerts.length === 0 && (
              <div className={styles.feedEmpty}>Sin alertas activas ✓</div>
            )}
            {alerts.map(a => (
              <div key={a.id} className={`${styles.alertItem} ${styles[a.type]}`}>
                <span className={styles.alertIcon}>{TYPE_ICON[a.type]}</span>
                <div className={styles.alertContent}>
                  <p className={styles.alertMsg}>{a.msg}</p>
                  <span className={styles.alertTime}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Volumen de Alertas — 24 h" icon="📊">
          <div className={styles.chartWrap}>
            <Bar
              data={{
                labels: HOURS,
                datasets: [
                  { label: 'Críticas', data: alertVol.map(d => d.critical), backgroundColor: 'rgba(255,61,107,.55)',  borderRadius: 3, stack: 'a' },
                  { label: 'Avisos',   data: alertVol.map(d => d.warning),  backgroundColor: 'rgba(245,197,0,.45)',  borderRadius: 3, stack: 'a' },
                  { label: 'Info',     data: alertVol.map(d => d.info),     backgroundColor: 'rgba(0,255,135,.25)',  borderRadius: 3, stack: 'a' },
                ],
              }}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: {
                  x: { ...baseScale, stacked: true, ticks: { ...baseScale.ticks, maxTicksLimit: 8 } },
                  y: { ...baseScale, stacked: true, beginAtZero: true },
                },
              }}
            />
          </div>
        </Panel>
      </div>

      {/* ── Thresholds ── */}
      <Panel title="Configuración de Umbrales" icon="⚙️">
        <div className={styles.threshGrid}>
          {THRESHOLDS.map(t => (
            <ThresholdSlider key={t.label} {...t} />
          ))}
        </div>
      </Panel>

    </div>
  );
}

function ThresholdSlider({ label, value, max, unit, color }) {
  return (
    <div className={styles.threshold}>
      <div className={styles.threshHeader}>
        <span className={styles.threshLabel}>{label}</span>
        <span className={styles.threshVal} style={{ color }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        defaultValue={value}
        className={styles.slider}
        style={{ '--thumb-color': color, '--track-color': color + '33' }}
      />
      <div className={styles.threshRange}>
        <span>0</span>
        <span style={{ color }}>{max / 2}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
