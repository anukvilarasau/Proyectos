import { useState, useEffect, useRef, useCallback } from 'react';
import {
  rand, rInt,
  generateTileStates, generateFaults,
  initConsumo, initProd, initMeta, initSobrante,
  initFaultHist, initThroughput, initTempZones, initHum, initPres,
  initKPIs, ALERT_POOL, TOTAL_TILES,
} from '../utils/mockData';

export function useRealtime(intervalMs = 3000) {
  const alertIdx = useRef(0);

  const [state, setState] = useState(() => {
    const tiles  = generateTileStates();
    const faults = generateFaults(tiles);
    return {
      kpis:       initKPIs(),
      faultCount: faults.filter(f => f.status === 'critical').length,
      charts: {
        consumo:    initConsumo(),
        prod:       initProd(),
        meta:       initMeta(),
        sobrante:   initSobrante(),
        faultHist:  initFaultHist(),
        throughput: initThroughput(),
        tempZones:  initTempZones(),
        hum:        initHum(),
        pres:       initPres(),
      },
      tiles,
      faults,
      alerts: [],
    };
  });

  const pushAlert = useCallback(() => {
    const a = ALERT_POOL[alertIdx.current % ALERT_POOL.length];
    alertIdx.current += 1;
    return {
      id:   Date.now() + Math.random(),
      type: a.type,
      msg:  a.msg,
      time: new Date().toLocaleTimeString('es-AR'),
    };
  }, []);

  useEffect(() => {
    /* seed initial alerts */
    setState(prev => ({
      ...prev,
      alerts: Array.from({ length: 6 }, () => {
        const a = ALERT_POOL[alertIdx.current % ALERT_POOL.length];
        alertIdx.current += 1;
        return { id: Date.now() + Math.random(), type: a.type, msg: a.msg, time: new Date().toLocaleTimeString('es-AR') };
      }),
    }));

    const id = setInterval(() => {
      setState(prev => {
        /* rolling chart arrays */
        const push = (arr, val) => [...arr.slice(1), val];

        const nextConsumo    = push(prev.charts.consumo, rInt(80, 220));
        const nextProd       = push(prev.charts.prod, rInt(400, 900));
        const nextThroughput = push(prev.charts.throughput, rInt(20, 80));
        const nextHum        = push(prev.charts.hum, rand(40, 75));
        const nextPres       = push(prev.charts.pres, rand(995, 1025));
        const nextTempZones  = prev.charts.tempZones.map(arr => push(arr, rand(22, 50)));

        /* random tile flip */
        let nextTiles = prev.tiles;
        if (Math.random() < 0.25) {
          const idx    = rInt(0, TOTAL_TILES - 1);
          const states = ['ok','ok','ok','ok','hot','fault','idle'];
          nextTiles = [...prev.tiles];
          nextTiles[idx] = states[rInt(0, states.length - 1)];
        }

        /* maybe push alert */
        let nextAlerts = prev.alerts;
        if (Math.random() < 0.4) {
          const alert = pushAlert();
          nextAlerts = [alert, ...prev.alerts].slice(0, 40);
        }

        return {
          ...prev,
          kpis: {
            consumo:     rInt(80, 220),
            produccion:  rInt(400, 900),
            stock:       rInt(300, 1200),
            eficiencia:  rand(75, 98),
            temperatura: rand(24, 44),
          },
          charts: {
            ...prev.charts,
            consumo:    nextConsumo,
            prod:       nextProd,
            throughput: nextThroughput,
            hum:        nextHum,
            pres:       nextPres,
            tempZones:  nextTempZones,
          },
          tiles:  nextTiles,
          alerts: nextAlerts,
        };
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, pushAlert]);

  const clearAlerts = useCallback(() => {
    setState(prev => ({ ...prev, alerts: [] }));
  }, []);

  return { ...state, clearAlerts };
}
