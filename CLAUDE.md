# StepIQ Dashboard — CLAUDE.md

## Proyecto

Dashboard industrial de monitoreo para **StepIQ**, un sistema de baldosas inteligentes (IoT). Muestra métricas de consumo energético, producción, stock sobrante, detección de fallas y alertas en tiempo real.

**Dev server:** `npm run dev` → `http://localhost:5173`
**Build:** `npm run build`

## Stack

- **React 18** + **Vite 5**
- **react-chartjs-2** + **Chart.js 4** para todos los gráficos
- **CSS Modules** (un `.module.css` por cada `.jsx`)
- Sin librerías de UI externas — todo custom
- Sin TypeScript — JS puro con JSDoc si hace falta documentar tipos

## Estructura

```
src/
├── main.jsx                          # Entry point — registra Chart.js y defaults globales
├── App.jsx / App.module.css          # Raíz: maneja tab activo, provee datos del hook
├── styles/globals.css                # Design tokens (variables CSS), resets, animaciones globales
├── utils/mockData.js                 # Generadores de datos simulados y constantes
├── hooks/useRealtime.js              # Hook central de estado + ticker cada 3 s
└── components/
    ├── layout/
    │   └── Header.jsx                # Navegación por tabs, reloj, indicador de estado
    ├── ui/                           # Componentes reutilizables (primitivos)
    │   ├── KpiCard.jsx               # Tarjeta de métrica con sparkline en canvas
    │   ├── Panel.jsx                 # Contenedor con header y body estilizado
    │   ├── Badge.jsx                 # Etiqueta de severidad (critical/warning/resolved/info)
    │   └── ProgressBar.jsx          # Barra de progreso con variantes de color
    └── sections/                    # Una sección por tab — cada una recibe datos por props
        ├── Overview.jsx             # KPIs + 7 gráficos de monitoreo general
        ├── TileMap.jsx              # Grid 20×15 de baldosas con tooltip
        ├── Faults.jsx               # Tabla de fallas + mantenimiento predictivo + MTTR/MTBF
        ├── Production.jsx           # Producción por línea + radar de balance + throughput
        └── Alerts.jsx               # Feed de alertas + volumen 24h + sliders de umbrales
```

## Paleta de colores

Todas las variables están en `src/styles/globals.css`. **Nunca usar colores hardcodeados** — siempre referenciar variables CSS.

| Variable       | Valor     | Uso                              |
|----------------|-----------|----------------------------------|
| `--neon`       | `#00ff87` | Color primario, acentos activos  |
| `--neon-dim`   | `#00cc6a` | Títulos de panel, estado         |
| `--teal`       | `#00ffc8` | Secundario, gráficos             |
| `--lime`       | `#aaff3e` | Acento terciario, highlights     |
| `--red`        | `#ff3d6b` | Errores, fallas críticas         |
| `--amber`      | `#f5c500` | Avisos, temperatura alta         |
| `--purple`     | `#bf64ff` | Métricas secundarias             |
| `--bg-0..4`    | —         | Fondos en escala de verde oscuro |
| `--t0..4`      | —         | Texto en escala de verde claro   |
| `--border`     | —         | Borde sutil (10% opacidad)       |
| `--border-bright` | —      | Borde activo/hover (28% opacidad)|

## Convenciones

### Componentes
- **Un componente = un archivo `.jsx` + su `.module.css`** en la misma carpeta
- Los componentes de sección reciben **solo datos por props** — no hacen fetch ni mutan estado
- El estado global vive en `useRealtime.js` y baja desde `App.jsx`
- Los componentes UI (`/ui/`) son stateless y puramente visuales

### CSS Modules
- Clases en **camelCase**: `.chartWrap`, `.kpiGrid`
- Variantes de color con data-attributes: `[data-variant="critical"]` (ver `Badge.module.css`)
- Variantes de color con clases paralelas: `.fill.neon`, `.fill.red` (ver `ProgressBar.module.css`)
- Breakpoints en el propio módulo — no en globals

### Gráficos (Chart.js)
- Registrar componentes Chart.js **una sola vez** en `main.jsx`
- Defaults globales de tema también en `main.jsx`
- Cada gráfico usa `animation: false` para rendimiento en tiempo real
- Escala base reutilizable definida localmente en cada sección:
  ```js
  const baseScale = { grid: { color: 'rgba(0,255,135,0.05)' }, ticks: { color: '#3a7058' } };
  ```

### Datos en tiempo real
- `useRealtime(intervalMs)` devuelve: `{ kpis, charts, tiles, faults, faultCount, alerts, clearAlerts }`
- Las series de gráficos son arrays que rotan: `push(arr.slice(1), nuevoValor)`
- Los datos son simulados — al conectar una API real, reemplazar solo el interior del hook

## Agregar una nueva sección

1. Crear `src/components/sections/NuevaSección.jsx` y `NuevaSección.module.css`
2. Agregar el tab en `Header.jsx` (array `TABS`)
3. Renderizar condicionalmente en `App.jsx`
4. Si necesita datos nuevos, extenderlos en `useRealtime.js` y `mockData.js`

## Agregar un nuevo KPI

Agregar en `Overview.jsx` dentro del `.kpiGrid`:
```jsx
<KpiCard
  label="Nombre métrica"
  value={`${kpis.nuevaMetrica} u`}
  delta="descripción del delta"
  deltaUp={true}
  color="teal"           // neon | teal | lime | red | amber | purple
  icon="🔧"
  sparkData={charts.nuevaSerie.slice(-15)}
/>
```

## Lo que NO hacer

- No instalar librerías de componentes UI (MUI, Chakra, Ant Design, etc.)
- No usar colores hexadecimales directos en JSX o CSS — siempre variables CSS
- No poner lógica de datos dentro de los componentes de sección
- No usar `useEffect` para datos en secciones — todo viene de props desde `App.jsx`
- No animar gráficos Chart.js (`animation: false` siempre en dashboards en tiempo real)
- No agregar `console.log` de debug al código commiteado
