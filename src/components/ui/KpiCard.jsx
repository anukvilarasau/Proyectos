import { useEffect, useRef } from 'react';
import styles from './KpiCard.module.css';

export default function KpiCard({ label, value, delta, deltaUp, color = 'neon', icon, sparkData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !sparkData?.length) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const w      = canvas.width;
    const h      = canvas.height;
    const data   = sparkData;
    const min    = Math.min(...data);
    const max    = Math.max(...data);
    const range  = max - min || 1;

    ctx.clearRect(0, 0, w, h);

    /* gradient fill */
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const hex  = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`).trim();
    grad.addColorStop(0, hex + '44');
    grad.addColorStop(1, hex + '00');

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    /* close for fill */
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* line */
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = hex;
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  }, [sparkData, color]);

  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.topBar} />
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {delta && (
          <p className={`${styles.delta} ${deltaUp ? styles.up : styles.down}`}>
            {deltaUp ? '▲' : '▼'} {delta}
          </p>
        )}
        {sparkData && (
          <canvas ref={canvasRef} className={styles.spark} width={120} height={30} />
        )}
      </div>
      <div className={styles.iconBg}>{icon}</div>
    </div>
  );
}
