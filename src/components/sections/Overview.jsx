import { Line, Bar, Doughnut } from 'react-chartjs-2';
import KpiCard from '../ui/KpiCard';
import Panel from '../ui/Panel';
import ProgressBar from '../ui/ProgressBar';
import { HOURS, DAYS7, ZONES, fmt, fmtDec } from '../../utils/mockData';
import styles from './Overview.module.css';

/* ── Chart shared options ── */
const baseScale = {
  grid: { color: 'rgba(0,255,135,0.05)' },
  ticks: { color: '#3a7058' },
};

const noLegend  = { plugins: { legend: { display: false } } };
const animation = { animation: false, responsive: true, maintainAspectRatio: false };

export default function Overview({ charts, kpis }) {
  const { consumo, prod, meta, sobrante, tempZones, hum, pres } = charts;

  /* KPI sparklines — last 15 points */
  const s = arr => arr.slice(-15);

  const OEE = [
    { label: 'Disponibilidad',  value: 94.2, color: 'neon' },
    { label: 'Rendimiento',     value: 87.5, color: 'teal' },
    { label: 'Calidad',         value: 96.8, color: 'lime' },
    { label: 'OEE General',     value: 79.8, color: 'amber' },
  ];

  const faultDonut = {
    labels: ['Crack','Fractura','Sensor','Temp','Presión','Circuito','Humedad'],
    datasets: [{
      data: [22,18,12,9,8,7,5],
      backgroundColor: [
        'rgba(255,61,107,.7)',
        'rgba(245,197,0,.7)',
        'rgba(0,255,135,.6)',
        'rgba(0,255,200,.6)',
        'rgba(191,100,255,.6)',
        'rgba(77,159,255,.6)',
        'rgba(170,255,62,.6)',
      ],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  return (
    <div className={styles.root}>

      {/* ── KPI Strip ── */}
      <div className={styles.kpiGrid}>
        <KpiCard label="Consumo Energético" value={`${kpis.consumo} kWh`}
          delta="4.2% vs ayer" deltaUp color="neon" icon="⚡" sparkData={s(consumo)} />
        <KpiCard label="Producción Hoy" value={`${fmt(kpis.produccion)} u`}
          delta="7.1% vs ayer" deltaUp color="teal" icon="🏭" sparkData={s(prod)} />
        <KpiCard label="Sobrante / Stock" value={`${fmt(kpis.stock)} u`}
          delta="1.3% vs ayer" deltaUp={false} color="amber" icon="📦" sparkData={s(sobrante)} />
        <KpiCard label="Baldosas c/ Falla" value={charts.faultHist.at(-1)}
          delta="2 nuevas hoy" deltaUp={false} color="red" icon="⚠️" sparkData={s(charts.faultHist)} />
        <KpiCard label="Eficiencia OEE" value={`${fmtDec(kpis.eficiencia)}%`}
          delta="En rango normal" deltaUp color="lime" icon="📊"
          sparkData={s(consumo).map(v => 75 + (v / 220) * 23)} />
        <KpiCard label="Temperatura Media" value={`${fmtDec(kpis.temperatura)}°C`}
          delta="Rango operativo" deltaUp color="purple" icon="🌡️" sparkData={s(tempZones[0])} />
      </div>

      {/* ── Row 1: Consumo + Producción ── */}
      <div className={styles.row2}>
        <Panel title="Consumo Energético — Últimas 24 h" icon="⚡" headerRight="kWh">
          <div className={styles.chartWrap}>
            <Line
              data={{
                labels: HOURS,
                datasets: [{
                  label: 'kWh',
                  data: consumo,
                  borderColor: '#00ff87',
                  backgroundColor: 'rgba(0,255,135,0.1)',
                  borderWidth: 2, fill: true, tension: .4, pointRadius: 0,
                }],
              }}
              options={{
                ...animation, ...noLegend,
                scales: { x: { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 8 } }, y: baseScale },
              }}
            />
          </div>
        </Panel>

        <Panel title="Producción vs Meta" icon="🏭" headerRight="unidades">
          <div className={styles.chartWrap}>
            <Bar
              data={{
                labels: HOURS,
                datasets: [
                  { label: 'Meta', data: meta, type: 'line', borderColor: 'rgba(245,197,0,.6)',
                    backgroundColor: 'transparent', borderDash: [5,4], tension: 0, pointRadius: 0 },
                  { label: 'Producción', data: prod,
                    backgroundColor: 'rgba(0,255,200,.22)', borderColor: '#00ffc8', borderWidth: 1, borderRadius: 4 },
                ],
              }}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: { x: { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 8 } }, y: baseScale },
              }}
            />
          </div>
        </Panel>
      </div>

      {/* ── Row 2: Sobrante + Donut + OEE ── */}
      <div className={styles.row3}>
        <Panel title="Sobrante Acumulado — 7 días" icon="📦">
          <div className={styles.chartWrap}>
            <Line
              data={{
                labels: DAYS7,
                datasets: [{
                  label: 'Sobrante',
                  data: sobrante,
                  borderColor: '#f5c500',
                  backgroundColor: 'rgba(245,197,0,0.12)',
                  borderWidth: 2, fill: true, tension: .35,
                  pointBackgroundColor: '#f5c500', pointRadius: 4,
                }],
              }}
              options={{ ...animation, ...noLegend, scales: { x: baseScale, y: baseScale } }}
            />
          </div>
        </Panel>

        <Panel title="Tipos de Fallas" icon="🔴">
          <div className={styles.donutWrap}>
            <Doughnut
              data={faultDonut}
              options={{
                ...animation,
                cutout: '65%',
                plugins: { legend: { position: 'bottom', labels: { color: '#3a7058', boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        </Panel>

        <Panel title="Indicadores OEE" icon="📊">
          <div className={styles.oeeList}>
            {OEE.map(o => (
              <ProgressBar key={o.label} label={o.label} value={o.value} color={o.color} />
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Row 3: Temperatura + Humedad ── */}
      <div className={styles.row2}>
        <Panel title="Temperatura de Superficies — Tiempo Real" icon="🌡️" headerRight="°C">
          <div className={styles.chartWrap}>
            <Line
              data={{
                labels: Array.from({ length: 30 }, (_, i) => `-${29 - i}s`),
                datasets: [
                  { label: 'Zona A', data: tempZones[0], borderColor: '#ff3d6b', backgroundColor: 'transparent', borderWidth: 1.5, tension: .4, pointRadius: 0 },
                  { label: 'Zona B', data: tempZones[1], borderColor: '#00ff87', backgroundColor: 'transparent', borderWidth: 1.5, tension: .4, pointRadius: 0 },
                  { label: 'Zona C', data: tempZones[2], borderColor: '#00ffc8', backgroundColor: 'transparent', borderWidth: 1.5, tension: .4, pointRadius: 0 },
                ],
              }}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: { x: { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 6 } }, y: baseScale },
              }}
            />
          </div>
        </Panel>

        <Panel title="Humedad & Presión Atmosférica" icon="💧">
          <div className={styles.chartWrap}>
            <Line
              data={{
                labels: Array.from({ length: 30 }, (_, i) => `-${29 - i}s`),
                datasets: [
                  { label: 'Humedad %', data: hum, borderColor: '#bf64ff', backgroundColor: 'transparent', borderWidth: 1.5, tension: .4, pointRadius: 0, yAxisID: 'y' },
                  { label: 'Presión hPa', data: pres, borderColor: '#f5c500', backgroundColor: 'transparent', borderWidth: 1.5, tension: .4, pointRadius: 0, yAxisID: 'y1' },
                ],
              }}
              options={{
                ...animation,
                plugins: { legend: { labels: { color: '#3a7058' } } },
                scales: {
                  x:  { ...baseScale, ticks: { ...baseScale.ticks, maxTicksLimit: 6 } },
                  y:  { ...baseScale, position: 'left' },
                  y1: { grid: { display: false }, ticks: { color: '#c5a000' }, position: 'right' },
                },
              }}
            />
          </div>
        </Panel>
      </div>

    </div>
  );
}
