import { Bar, Line, Radar } from 'react-chartjs-2';
import Panel from '../ui/Panel';
import { MONTHS, ZONES, rInt, rand } from '../../utils/mockData';
import styles from './Production.module.css';

const animation = { animation: false, responsive: true, maintainAspectRatio: false };
const baseScale = { grid: { color: 'rgba(0,255,135,0.05)' }, ticks: { color: '#3a7058' } };

export default function Production({ charts }) {
  const { throughput, prod } = charts;

  const monthlyData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Línea 1',
        data: MONTHS.map(() => rInt(8000, 16000)),
        backgroundColor: 'rgba(0,255,135,.28)',
        borderColor: '#00ff87',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'prod',
      },
      {
        label: 'Línea 2',
        data: MONTHS.map(() => rInt(6000, 14000)),
        backgroundColor: 'rgba(0,255,200,.22)',
        borderColor: '#00ffc8',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'prod',
      },
      {
        label: 'Línea 3',
        data: MONTHS.map(() => rInt(4000, 10000)),
        backgroundColor: 'rgba(170,255,62,.2)',
        borderColor: '#aaff3e',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'prod',
      },
    ],
  };

  const balanceRadar = {
    labels: ZONES,
    datasets: [
      { label: 'Producción', data: ZONES.map(() => rInt(60, 100)), borderColor: '#00ff87', backgroundColor: 'rgba(0,255,135,.1)', borderWidth: 2, pointBackgroundColor: '#00ff87' },
      { label: 'Consumo',    data: ZONES.map(() => rInt(40, 90)),  borderColor: '#00ffc8', backgroundColor: 'rgba(0,255,200,.08)', borderWidth: 2, pointBackgroundColor: '#00ffc8' },
      { label: 'Sobrante',   data: ZONES.map(() => rInt(10, 50)),  borderColor: '#f5c500', backgroundColor: 'rgba(245,197,0,.08)', borderWidth: 2, pointBackgroundColor: '#f5c500' },
    ],
  };

  return (
    <div className={styles.root}>

      {/* ── Line summary ── */}
      <div className={styles.lineCards}>
        {['Línea 1', 'Línea 2', 'Línea 3'].map((line, i) => {
          const val   = rInt(400, 900);
          const goal  = 700;
          const pct   = Math.round((val / goal) * 100);
          const color = pct >= 100 ? 'var(--neon)' : pct >= 80 ? 'var(--amber)' : 'var(--red)';
          return (
            <div key={line} className={styles.lineCard}>
              <div className={styles.lineName}>{line}</div>
              <div className={styles.lineVal} style={{ color }}>{val.toLocaleString('es-AR')} u</div>
              <div className={styles.linePct} style={{ color }}>
                {pct}% de meta
              </div>
              <div className={styles.lineBar}>
                <div className={styles.lineBarFill} style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Monthly + Balance ── */}
      <div className={styles.row2}>
        <Panel title="Producción Mensual por Línea" icon="◉">
          <div className={styles.chartWrap}>
            <Bar
              data={monthlyData}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: {
                  x: { ...baseScale, stacked: true },
                  y: { ...baseScale, stacked: true },
                },
              }}
            />
          </div>
        </Panel>

        <Panel title="Balance por Zona" icon="◈">
          <div className={styles.chartWrap}>
            <Radar
              data={balanceRadar}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: {
                  r: {
                    grid:        { color: 'rgba(0,255,135,0.09)' },
                    angleLines:  { color: 'rgba(0,255,135,0.06)' },
                    pointLabels: { color: '#66bf90', font: { size: 11 } },
                    ticks:       { display: false },
                  },
                },
              }}
            />
          </div>
        </Panel>
      </div>

      {/* ── Throughput realtime ── */}
      <Panel title="Throughput en Tiempo Real — Últimas 60 s" icon="⚡"
        headerRight={<span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}>
          {throughput.at(-1)} u/min
        </span>}
      >
        <div className={styles.chartTallWrap}>
          <Line
            data={{
              labels: Array.from({ length: 60 }, (_, i) => `-${59 - i}s`),
              datasets: [{
                label: 'u/min',
                data: throughput,
                borderColor: '#00ff87',
                backgroundColor: 'rgba(0,255,135,0.08)',
                borderWidth: 2, fill: true, tension: .3, pointRadius: 0,
              }],
            }}
            options={{
              ...animation,
              plugins: { legend: { display: false } },
              scales: {
                x: { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 10 } },
                y: { ...baseScale, beginAtZero: true },
              },
            }}
          />
        </div>
      </Panel>

    </div>
  );
}
