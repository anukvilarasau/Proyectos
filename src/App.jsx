import { useState } from 'react';
import Sidebar    from './components/layout/Header';
import Overview   from './components/sections/Overview';
import TileMap    from './components/sections/TileMap';
import Faults     from './components/sections/Faults';
import Production from './components/sections/Production';
import Alerts     from './components/sections/Alerts';
import { useRealtime } from './hooks/useRealtime';
import styles from './App.module.css';

const PAGE_TITLES = {
  overview:   'Dashboard',
  tilemap:    'Mapa de Baldosas',
  faults:     'Detección de Fallas',
  production: 'Producción',
  alerts:     'Alertas',
  settings:   'Configuración',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { kpis, charts, tiles, faults, faultCount, alerts, clearAlerts } = useRealtime(3000);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <div className={styles.layout}>
      {/* Overlay backdrop for mobile */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        faultCount={faultCount}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={styles.content}>
        {/* Top bar */}
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {/* Hamburger — only visible on mobile */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Abrir menú"
            >
              <span className={styles.hLine} />
              <span className={styles.hLine} />
              <span className={styles.hLine} />
            </button>
            <h1 className={styles.pageTitle}>
              StepIQ <span className={styles.pageTitleSub}>{PAGE_TITLES[activeTab]}</span>
            </h1>
          </div>
          <div className={styles.topbarRight}>
            {faultCount > 0 && (
              <div className={styles.alertChip}>
                <span className={styles.alertChipDot} />
                {faultCount} fallas activas
              </div>
            )}
            <div className={styles.versionChip}>v2.0</div>
          </div>
        </div>

        {/* Main section */}
        <main className={styles.main}>
          {activeTab === 'overview'   && <Overview    charts={charts} kpis={kpis} />}
          {activeTab === 'tilemap'    && <TileMap     tiles={tiles} />}
          {activeTab === 'faults'     && <Faults      faults={faults} charts={charts} />}
          {activeTab === 'production' && <Production  charts={charts} />}
          {activeTab === 'alerts'     && <Alerts      alerts={alerts} clearAlerts={clearAlerts} />}
          {activeTab === 'settings'   && (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>⚙</span>
              <p>Configuración — próximamente</p>
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <span>StepIQ Control Center</span>
          <span className={styles.dot}>·</span>
          <span>React + Vite · Actualización cada 3 s</span>
          <span className={styles.dot}>·</span>
          <span style={{ color: 'var(--t4)' }}>Datos simulados</span>
        </footer>
      </div>
    </div>
  );
}
