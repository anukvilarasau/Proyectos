import styles from './ProgressBar.module.css';

export default function ProgressBar({ label, value, max = 100, color = 'neon', showValue = true }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {showValue && (
          <span className={`${styles.value} ${styles[color]}`}>
            {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
          </span>
        )}
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
