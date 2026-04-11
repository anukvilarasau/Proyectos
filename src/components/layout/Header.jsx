import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const TABS = [
  { id: 'overview',   label: 'Overview',         icon: '◈' },
  { id: 'tilemap',    label: 'Mapa de Baldosas',  icon: '⊞' },
  { id: 'faults',     label: 'Fallas',            icon: '⚡' },
  { id: 'production', label: 'Producción',         icon: '◉' },
  { id: 'alerts',     label: 'Alertas',            icon: '◎' },
];

export default function Header({ activeTab, onTabChange, faultCount }) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString('es-AR'));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>
        <span className={styles.logoText}>
          Step<span className={styles.logoAccent}>IQ</span>
        </span>
        <span className={styles.logoBadge}>v2.0</span>
      </div>

      {/* Nav tabs */}
      <nav className={styles.nav}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
            {tab.id === 'faults' && faultCount > 0 && (
              <span className={styles.faultBubble}>{faultCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className={styles.status}>
        <div className={styles.statusGroup}>
          <span className={styles.pulseDot} />
          <span className={styles.statusText}>EN LÍNEA</span>
        </div>
        <span className={styles.clock}>{clock}</span>
      </div>
    </header>
  );
}
