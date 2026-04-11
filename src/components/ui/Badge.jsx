import styles from './Badge.module.css';

const LABELS = {
  critical: 'CRÍTICA',
  warning:  'AVISO',
  resolved: 'RESUELTA',
  info:     'INFO',
  ok:       'OK',
  inactive: 'INACTIVA',
};

export default function Badge({ variant = 'info', children }) {
  return (
    <span className={styles.badge} data-variant={variant}>
      {children ?? LABELS[variant] ?? variant}
    </span>
  );
}
