import { Bar, Line, Radar } from 'react-chartjs-2';
import Panel from '../ui/Panel';
import { MONTHS, ZONES, rInt } from '../../utils/mockData';
import styles from './Production.module.css';

const animation = { animation: false, responsive: true, maintainAspectRatio: false };
const baseScale = {
  grid:  { color: 'rgba(255,255,255,0.05)' },
  ticks: { color: '#505070' },
};

/* Metas diarias por línea en kWh */
const METAS_KWH = [150, 120, 90];

export default function Production({ charts }) {
  const { throughput } = charts;

  const monthlyData = {
    labels: MONTHS,
    datasets: [
      { label: 'Línea 1', data: MONTHS.map(() => rInt(1800, 4500)),
        backgroundColor: 'rgba(124,79,255,.30)', borderColor: '#7c4fff', borderWidth: 1, borderRadius: 4, stack: 'prod' },
      { label: 'Línea 2', data: MONTHS.map(() => rInt(1200, 3500)),
        backgroundColor: 'rgba(0,255,128,.22)', borderColor: '#00ff80', borderWidth: 1, borderRadius: 4, stack: 'prod' },
      { label: 'Línea 3', data: MONTHS.map(() => rInt(800, 2500)),
        backgroundColor: 'rgba(0,207,255,.20)', borderColor: '#00cfff', borderWidth: 1, borderRadius: 4, stack: 'prod' },
    ],
  };

  const balanceRadar = {
    labels: ZONES,
    datasets: [
      { label: 'Generación (kWh)', data: ZONES.map(() => rInt(60, 100)), borderColor: '#00ff80', backgroundColor: 'rgba(0,255,128,.08)', borderWidth: 2, pointBackgroundColor: '#00ff80' },
      { label: 'Consumo (kWh)',    data: ZONES.map(() => rInt(40, 90)),  borderColor: '#7c4fff', backgroundColor: 'rgba(124,79,255,.08)', borderWidth: 2, pointBackgroundColor: '#7c4fff' },
      { label: 'Excedente → Red',  data: ZONES.map(() => rInt(10, 50)),  borderColor: '#ffd600', backgroundColor: 'rgba(255,214,0,.06)',  borderWidth: 2, pointBackgroundColor: '#ffd600' },
    ],
  };

  return (
    <div className={styles.root}>

      {/* ── Tarjetas por línea ── */}
      <div className={styles.lineCards}>
        {['Línea 1', 'Línea 2', 'Línea 3'].map((line, i) => {
          const colors = ['var(--purple)', 'var(--neon)', 'var(--cyan)'];
          const val  = rInt(50, 200);
          const meta = METAS_KWH[i];
          const pct  = Math.round((val / meta) * 100);
          return (
            <div key={line} className={styles.lineCard}>
              <div className={styles.lineName}>{line}</div>
              <div className={styles.lineVal} style={{ color: colors[i] }}>
                {val} kWh
              </div>
              <div className={styles.linePct} style={{ color: colors[i] }}>
                {pct}% de meta ({meta} kWh)
              </div>
              <div className={styles.lineBar}>
                <div className={styles.lineBarFill}
                  style={{ width: `${Math.min(pct, 100)}%`, background: colors[i] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mensual + Balance ── */}
      <div className={styles.row2}>
        <Panel title="Energía Generada por Línea — Mensual" icon="⚡" headerRight="kWh">
          <div className={styles.chartWrap}>
            <Bar data={monthlyData}
              options={{ ...animation,
                plugins: { legend: { labels: { color: '#505070' } } },
                scales: {
                  x: { ...baseScale, stacked: true },
                  y: { ...baseScale, stacked: true,
                    title: { display: true, text: 'kWh', color: '#505070', font: { size: 10 } } },
                },
              }}
            />
          </div>
        </Panel>

        <Panel title="Balance Energético por Zona" icon="◈">
          <div className={styles.chartWrap}>
            <Radar data={balanceRadar}
              options={{ ...animation,
                plugins: { legend: { labels: { color: '#505070' } } },
                scales: { r: {
                  grid:        { color: 'rgba(255,255,255,0.07)' },
                  angleLines:  { color: 'rgba(255,255,255,0.05)' },
                  pointLabels: { color: '#8080aa', font: { size: 11 } },
                  ticks:       { display: false },
                } },
              }}
            />
          </div>
        </Panel>
      </div>

      {/* ── Potencia en tiempo real ── */}
      <Panel
        title="Potencia Generada — Tiempo Real"
        icon="⚡"
        headerRight={
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}>
            {throughput.at(-1)} W
          </span>
        }
      >
        <div className={styles.chartTallWrap}>
          <Line
            data={{
              labels: Array.from({ length: 60 }, (_, i) => `-${59 - i}s`),
              datasets: [{
                label: 'Vatios (W)',
                data: throughput,
                borderColor: '#00ff80',
                backgroundColor: 'rgba(0,255,128,0.07)',
                borderWidth: 2, fill: true, tension: .3, pointRadius: 0,
              }],
            }}
            options={{ ...animation,
              plugins: { legend: { display: false } },
              scales: {
                x: { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 10 } },
                y: { ...baseScale, beginAtZero: true,
                  title: { display: true, text: 'W', color: '#505070', font: { size: 10 } } },
              },
            }}
          />
        </div>
      </Panel>

    </div>
  );
}
