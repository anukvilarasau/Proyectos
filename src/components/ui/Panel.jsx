import styles from './Panel.module.css';

export default function Panel({ title, icon, headerRight, children, className = '' }) {
  return (
    <div className={`${styles.panel} ${className}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {title}
        </span>
        {headerRight && <div className={styles.right}>{headerRight}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
