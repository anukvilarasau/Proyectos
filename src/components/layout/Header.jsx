import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { id: 'overview',    label: 'Dashboard',        icon: '⊞' },
  { id: 'tilemap',     label: 'Mapa Baldosas',     icon: '◫' },
  { id: 'faults',      label: 'Fallas',            icon: '⚡' },
  { id: 'production',  label: 'Producción',         icon: '◉' },
  { id: 'alerts',      label: 'Alertas',            icon: '◎', badge: true },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Configuración', icon: '⚙' },
];

export default function Sidebar({ activeTab, onTabChange, faultCount }) {
  const [clock, setClock] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString('es-AR'));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>StepIQ</span>
            <span className={styles.logoSub}>Control Center</span>
          </div>
        )}
        <button className={styles.collapseBtn} onClick={() => setCollapsed(c => !c)} title="Colapsar">
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav divider label */}
      {!collapsed && <div className={styles.navLabel}>MENÚ</div>}

      {/* Main navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel2}>{item.label}</span>}
            {!collapsed && item.badge && faultCount > 0 && (
              <span className={styles.navBadge}>{faultCount}</span>
            )}
            {collapsed && item.badge && faultCount > 0 && (
              <span className={styles.navDot} />
            )}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className={styles.spacer} />

      {/* Status indicator */}
      {!collapsed && (
        <div className={styles.statusBox}>
          <div className={styles.statusRow}>
            <span className={styles.pulseDot} />
            <span className={styles.statusText}>Sistema Activo</span>
          </div>
          <span className={styles.clock}>{clock}</span>
        </div>
      )}

      {/* Bottom nav */}
      <div className={styles.bottomNav}>
        {BOTTOM_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel2}>{item.label}</span>}
          </button>
        ))}
      </div>

    </aside>
  );
}
