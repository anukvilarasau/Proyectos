import { useState } from 'react';
import Header    from './components/layout/Header';
import Overview  from './components/sections/Overview';
import TileMap   from './components/sections/TileMap';
import Faults    from './components/sections/Faults';
import Production from './components/sections/Production';
import Alerts    from './components/sections/Alerts';
import { useRealtime } from './hooks/useRealtime';
import styles from './App.module.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { kpis, charts, tiles, faults, faultCount, alerts, clearAlerts } = useRealtime(3000);

  return (
    <div className={styles.app}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        faultCount={faultCount}
      />

      <main className={styles.main}>
        {activeTab === 'overview'    && <Overview    charts={charts} kpis={kpis} />}
        {activeTab === 'tilemap'     && <TileMap     tiles={tiles} />}
        {activeTab === 'faults'      && <Faults      faults={faults} charts={charts} />}
        {activeTab === 'production'  && <Production  charts={charts} />}
        {activeTab === 'alerts'      && <Alerts      alerts={alerts} clearAlerts={clearAlerts} />}
      </main>

      <footer className={styles.footer}>
        <span>StepIQ Control Center v2.0</span>
        <span className={styles.footerDot}>·</span>
        <span>React + Vite · Actualización cada 3 s</span>
        <span className={styles.footerDot}>·</span>
        <span style={{ color: 'var(--t4)' }}>Datos simulados para demo</span>
      </footer>
    </div>
  );
}
