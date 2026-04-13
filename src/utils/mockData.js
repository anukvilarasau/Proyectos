/* ── helpers ── */
export const rand  = (a, b) => Math.random() * (b - a) + a;
export const rInt  = (a, b) => Math.floor(rand(a, b + 1));
export const fmt   = n => Math.round(n).toLocaleString('es-AR');
export const fmtDec = (n, d = 1) => Number(n).toFixed(d);

/* ── Labels ── */
export const HOURS  = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`);
export const DAYS7  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
export const ZONES  = ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'];

export const FAULT_TYPES = [
  'Crack superficial', 'Fractura interna', 'Sensor desconectado',
  'Temperatura crítica', 'Presión anómala', 'Circuito abierto', 'Humedad excesiva',
];

/* ── Tile grid ── */
export const TILE_COLS = 20;
export const TILE_ROWS = 15;
export const TOTAL_TILES = TILE_COLS * TILE_ROWS;

export function generateTileStates() {
  return Array.from({ length: TOTAL_TILES }, () => {
    const r = Math.random();
    if (r < 0.05)  return 'fault';
    if (r < 0.12)  return 'hot';
    if (r < 0.20)  return 'idle';
    if (r < 0.23)  return 'offline';
    return 'ok';
  });
}

export function generateFaults(tileStates) {
  return tileStates
    .map((state, i) => ({ id: i, state }))
    .filter(t => t.state === 'fault' || t.state === 'hot')
    .map(t => ({
      id:       `T${String(t.id + 1).padStart(4, '0')}`,
      zone:     ZONES[rInt(0, ZONES.length - 1)],
      type:     FAULT_TYPES[rInt(0, FAULT_TYPES.length - 1)],
      severity: t.state === 'fault' ? 'critical' : 'warning',
      minutes:  rInt(1, 180),
      status:   Math.random() > 0.7 ? 'resolved' : (t.state === 'fault' ? 'critical' : 'warning'),
    }));
}

/* ── Initial chart data arrays ── */
export const initConsumo     = () => Array.from({ length: 24 }, () => rInt(80, 220));
export const initProd        = () => Array.from({ length: 24 }, () => rInt(2, 15));   /* kWh generados por hora */
export const initMeta        = () => Array.from({ length: 24 }, () => 10);             /* meta: 10 kWh/h */
/* Energía sobrante inyectable a la red — valores en kWh */
export const initSobrante    = () => Array.from({ length: 7  }, () => rInt(20, 180));
export const initFaultHist   = () => Array.from({ length: 30 }, () => rInt(0, 12));
export const initThroughput  = () => Array.from({ length: 60 }, () => rInt(5, 45));   /* W — potencia generada en tiempo real */
export const initTempZones   = () => [0,1,2].map(() => Array.from({ length: 30 }, () => rand(22, 50)));
export const initHum         = () => Array.from({ length: 30 }, () => rand(40, 75));
export const initPres        = () => Array.from({ length: 30 }, () => rand(995, 1025));

export const initKPIs = () => ({
  consumo:    rInt(80, 220),
  produccion: rInt(50, 200),   /* kWh generados hoy en total */
  sobrante:   rInt(20, 180),   /* kWh disponibles para inyectar a la red */
  eficiencia: rand(75, 98),
  temperatura: rand(24, 44),
});

export const ALERT_POOL = [
  { type: 'critical', msg: 'Falla crítica detectada en T0023 — Zona A' },
  { type: 'warning',  msg: 'Temperatura elevada en T0145 — 51.3°C (Zona C)' },
  { type: 'info',     msg: 'Ciclo de mantenimiento completado — Zona B' },
  { type: 'critical', msg: 'Sensor desconectado en T0288 — Zona D' },
  { type: 'warning',  msg: 'Producción por debajo del 80% de meta — Línea 2' },
  { type: 'info',     msg: 'Backup de datos completado exitosamente' },
  { type: 'warning',  msg: 'Energía sobrante supera umbral de inyección — revisar conexión a red' },
  { type: 'critical', msg: 'Presión anómala detectada — 3 baldosas afectadas' },
  { type: 'info',     msg: 'Firmware actualizado: módulos IoT v3.2.1' },
  { type: 'warning',  msg: 'Consumo energético +18% respecto a la hora anterior' },
  { type: 'info',     msg: 'Zona E: inspección programada para mañana 08:00' },
  { type: 'critical', msg: 'Circuito abierto detectado — T0512, Zona E' },
];
