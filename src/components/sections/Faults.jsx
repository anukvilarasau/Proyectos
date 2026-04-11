import { Bar } from 'react-chartjs-2';
import Panel from '../ui/Panel';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { ZONES, rInt } from '../../utils/mockData';
import styles from './Faults.module.css';

const animation = { animation: false, responsive: true, maintainAspectRatio: false };
const baseScale = { grid: { color: 'rgba(0,255,135,0.05)' }, ticks: { color: '#3a7058' } };

export default function Faults({ faults, charts }) {
  const activeFaults  = faults.filter(f => f.status === 'critical').length;
  const resolvedToday = faults.filter(f => f.status === 'resolved').length;

  const predictiveHealth = ZONES.map(z => ({
    label: z,
    value: rInt(20, 98),
  }));

  return (
    <div className={styles.root}>

      {/* ── Summary strip ── */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryVal} style={{ color: 'var(--red)' }}>{activeFaults}</span>
          <span className={styles.summaryLabel}>Fallas activas</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryVal} style={{ color: 'var(--amber)' }}>
            {faults.filter(f => f.status === 'warning').length}
          </span>
          <span className={styles.summaryLabel}>En atención</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryVal} style={{ color: 'var(--neon)' }}>{resolvedToday}</span>
          <span className={styles.summaryLabel}>Resueltas hoy</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryVal} style={{ color: 'var(--teal)' }}>{faults.length}</span>
          <span className={styles.summaryLabel}>Total detectadas</span>
        </div>
      </div>

      {/* ── Table + History ── */}
      <div className={styles.row2}>
        <Panel
          title="Fallas Activas & Historial"
          icon="⚡"
          headerRight={<Badge variant="critical">{activeFaults} activas</Badge>}
        >
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Zona</th>
                  <th>Tipo</th>
                  <th>Severidad</th>
                  <th>Detectada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {faults.map(f => (
                  <tr key={f.id}>
                    <td className={styles.tdMono}>{f.id}</td>
                    <td>{f.zone}</td>
                    <td>{f.type}</td>
                    <td><Badge variant={f.severity} /></td>
                    <td className={styles.tdMuted}>hace {f.minutes} min</td>
                    <td><Badge variant={f.status} /></td>
                  </tr>
                ))}
                {faults.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>Sin fallas detectadas ✓</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Historial de Fallas — 30 días" icon="📉">
          <div className={styles.chartWrap}>
            <Bar
              data={{
                labels: Array.from({ length: 30 }, (_, i) => `D-${29 - i}`),
                datasets: [{
                  label: 'Fallas',
                  data: charts.faultHist,
                  backgroundColor: 'rgba(255,61,107,.35)',
                  borderColor: '#ff3d6b',
                  borderWidth: 1,
                  borderRadius: 3,
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

      {/* ── Predictive + MTTR ── */}
      <div className={styles.row2}>
        <Panel title="Mantenimiento Predictivo — Salud por Zona" icon="🔧">
          <div className={styles.predictList}>
            {predictiveHealth.map(p => {
              const color = p.value < 40 ? 'red' : p.value < 70 ? 'amber' : 'neon';
              return (
                <ProgressBar key={p.label} label={p.label} value={p.value} color={color} />
              );
            })}
            <div className={styles.predictNote}>
              ⚠ Zonas por debajo de 40% requieren intervención inmediata
            </div>
          </div>
        </Panel>

        <Panel title="MTTR / MTBF por Zona" icon="⏱️">
          <div className={styles.chartWrap}>
            <Bar
              data={{
                labels: ZONES,
                datasets: [
                  { label: 'MTTR (min)', data: ZONES.map(() => rInt(15, 90)),
                    backgroundColor: 'rgba(255,61,107,.35)', borderColor: '#ff3d6b', borderWidth: 1, borderRadius: 4 },
                  { label: 'MTBF (h)', data: ZONES.map(() => rInt(100, 800)),
                    backgroundColor: 'rgba(0,255,135,.2)', borderColor: '#00ff87', borderWidth: 1, borderRadius: 4 },
                ],
              }}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: { x: baseScale, y: baseScale },
              }}
            />
          </div>
        </Panel>
      </div>

    </div>
  );
}
