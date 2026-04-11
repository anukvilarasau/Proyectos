import { useState, useMemo } from 'react';
import Panel from '../ui/Panel';
import KpiCard from '../ui/KpiCard';
import { TILE_COLS, TILE_ROWS, TOTAL_TILES, ZONES, rand, fmtDec } from '../../utils/mockData';
import styles from './TileMap.module.css';

const STATE_LABEL = { ok: 'Operativa', hot: 'Temp. Alta', fault: 'Falla Detectada', idle: 'Inactiva', offline: 'Sin Señal' };

export default function TileMap({ tiles }) {
  const [tooltip, setTooltip] = useState(null);

  const counts = useMemo(() => {
    const c = { ok: 0, hot: 0, fault: 0, idle: 0, offline: 0 };
    tiles.forEach(s => { c[s] = (c[s] || 0) + 1; });
    return c;
  }, [tiles]);

  const tileData = useMemo(() =>
    tiles.map((state, i) => ({
      id:    i + 1,
      state,
      zone:  ZONES[Math.floor(i / (TOTAL_TILES / ZONES.length))],
      temp:  fmtDec(rand(22, 58)),
      steps: Math.floor(rand(0, 2400)),
    })),
  [tiles]);

  return (
    <div className={styles.root}>
      <Panel
        title="Mapa de Baldosas — Planta Principal"
        icon="⊞"
        headerRight={
          <span>
            {counts.ok} op · {counts.fault} falla · {counts.hot} temp alta
          </span>
        }
      >
        {/* Grid */}
        <div className={styles.gridWrap}>
          <div
            className={styles.grid}
            style={{ gridTemplateColumns: `repeat(${TILE_COLS}, 1fr)` }}
          >
            {tileData.map(tile => (
              <div
                key={tile.id}
                className={`${styles.tile} ${styles[tile.state]}`}
                onMouseEnter={e => setTooltip({ tile, x: e.clientX, y: e.clientY })}
                onMouseMove={e  => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {Object.entries(STATE_LABEL).map(([state, label]) => (
            <div key={state} className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles[state]}`} />
              <span>{label}</span>
              <span className={styles.legendCount}>({counts[state] ?? 0})</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Mini KPI Strip */}
      <div className={styles.kpiStrip}>
        <KpiCard label="Total Baldosas"  value={TOTAL_TILES}          color="neon"   icon="⬛" />
        <KpiCard label="Operativas"      value={counts.ok}            color="neon"   icon="✅" />
        <KpiCard label="Temp. Alta"      value={counts.hot}           color="amber"  icon="🔥" />
        <KpiCard label="Con Falla"       value={counts.fault}         color="red"    icon="❌" />
        <KpiCard label="Inactivas"       value={counts.idle}          color="purple" icon="⏸️" />
        <KpiCard label="Sin Señal"       value={counts.offline}       color="teal"   icon="📵" />
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x + 14, top: tooltip.y - 12 }}
        >
          <div className={styles.tooltipId}>Baldosa #{tooltip.tile.id}</div>
          <div className={styles.tooltipRow}>
            <span>Zona</span><span>{tooltip.tile.zone}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Estado</span>
            <span className={styles[`tt_${tooltip.tile.state}`]}>
              {STATE_LABEL[tooltip.tile.state]}
            </span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Temperatura</span><span>{tooltip.tile.temp}°C</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Pasos hoy</span><span>{tooltip.tile.steps.toLocaleString('es-AR')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
