import { Bar, Line, Radar } from 'react-chartjs-2';
import Panel from '../ui/Panel';
import { MONTHS, ZONES, rInt } from '../../utils/mockData';
import styles from './Production.module.css';

const animation = { animation: false, responsive: true, maintainAspectRatio: false };
const baseScale = {
  grid:  { color: 'rgba(255,255,255,0.05)' },
  ticks: { color: '#505070' },
};

export default function Production({ charts }) {
  const { throughput } = charts;

  const monthlyData = {
    labels: MONTHS,
    datasets: [
      { label: 'Línea 1', data: MONTHS.map(() => rInt(8000, 16000)),
        backgroundColor: 'rgba(124,79,255,.30)', borderColor: '#7c4fff', borderWidth: 1, borderRadius: 4, stack: 'prod' },
      { label: 'Línea 2', data: MONTHS.map(() => rInt(6000, 14000)),
        backgroundColor: 'rgba(0,255,128,.22)', borderColor: '#00ff80', borderWidth: 1, borderRadius: 4, stack: 'prod' },
      { label: 'Línea 3', data: MONTHS.map(() => rInt(4000, 10000)),
        backgroundColor: 'rgba(0,207,255,.20)', borderColor: '#00cfff', borderWidth: 1, borderRadius: 4, stack: 'prod' },
    ],
  };

  const balanceRadar = {
    labels: ZONES,
    datasets: [
      { label: 'Producción', data: ZONES.map(() => rInt(60, 100)), borderColor: '#00ff80', backgroundColor: 'rgba(0,255,128,.08)', borderWidth: 2, pointBackgroundColor: '#00ff80' },
      { label: 'Consumo',    data: ZONES.map(() => rInt(40, 90)),  borderColor: '#7c4fff', backgroundColor: 'rgba(124,79,255,.08)', borderWidth: 2, pointBackgroundColor: '#7c4fff' },
      { label: 'Sobrante',   data: ZONES.map(() => rInt(10, 50)),  borderColor: '#ffd600', backgroundColor: 'rgba(255,214,0,.06)',  borderWidth: 2, pointBackgroundColor: '#ffd600' },
    ],
  };

  return (
    <div className={styles.root}>

      {/* ── Line summary cards ── */}
      <div className={styles.lineCards}>
        {['Línea 1', 'Línea 2', 'Línea 3'].map((line, i) => {
          const colors = ['var(--purple)', 'var(--neon)', 'var(--cyan)'];
          const val = rInt(400, 900);
          const goal = 700;
          const pct = Math.round((val / goal) * 100);
          return (
            <div key={line} className={styles.lineCard}>
              <div className={styles.lineName}>{line}</div>
              <div className={styles.lineVal} style={{ color: colors[i] }}>
                {val.toLocaleString('es-AR')} u
              </div>
              <div className={styles.linePct} style={{ color: colors[i] }}>{pct}% de meta</div>
              <div className={styles.lineBar}>
                <div className={styles.lineBarFill}
                  style={{ width: `${Math.min(pct, 100)}%`, background: colors[i] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Monthly + Balance ── */}
      <div className={styles.row2}>
        <Panel title="Producción Mensual por Línea" icon="◉">
          <div className={styles.chartWrap}>
            <Bar data={monthlyData}
              options={{ ...animation,
                plugins: { legend: { labels: { color: '#505070' } } },
                scales: { x: { ...baseScale, stacked: true }, y: { ...baseScale, stacked: true } } }}
            />
          </div>
        </Panel>

        <Panel title="Balance por Zona" icon="◈">
          <div className={styles.chartWrap}>
            <Radar data={balanceRadar}
              options={{ ...animation,
                plugins: { legend: { labels: { color: '#505070' } } },
                scales: { r: {
                  grid:        { color: 'rgba(255,255,255,0.07)' },
                  angleLines:  { color: 'rgba(255,255,255,0.05)' },
                  pointLabels: { color: '#8080aa', font: { size: 11 } },
                  ticks:       { display: false },
                } } }}
            />
          </div>
        </Panel>
      </div>

      {/* ── Throughput ── */}
      <Panel title="Throughput en Tiempo Real — Últimas 60 s" icon="⚡"
        headerRight={
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}>
            {throughput.at(-1)} u/min
          </span>
        }
      >
        <div className={styles.chartTallWrap}>
          <Line
            data={{
              labels: Array.from({ length: 60 }, (_, i) => `-${59 - i}s`),
              datasets: [{
                label: 'u/min',
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
                y: { ...baseScale, beginAtZero: true },
              } }}
          />
        </div>
      </Panel>

    </div>
  );
}
