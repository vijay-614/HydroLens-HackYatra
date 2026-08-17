/* =========================================================
   HYDROLENSE — api.js
   All network / data-access functions live here.

   BACKEND CONTRACT (implement these on your server):
     GET  /api/sensors             -> [{ id, pressure, flow, status, ... }]
     GET  /api/wards                -> [{ id, area, ward, status, ... }]
     GET  /api/leaks                 -> [{ location, severity, probability, ... }]
     GET  /api/tank-levels           -> [{ id, level, capacity, ... }]
     GET  /api/maintenance           -> [{ id, area, task, status, eta, ... }]
     POST /predict-leak              -> { risk, status }  (FastAPI + Random Forest/XGBoost/LSTM)

   Until a real backend is connected, every function below
   transparently falls back to the bundled /data/*.json mock
   files so the dashboard runs with zero configuration and
   zero console errors.
   ========================================================= */

const HydroAPI = (() => {

  const BASE_URL = "http://localhost:8000/api"; // Updated to match FastAPI backend port
  const PREDICT_URL = "http://localhost:8000/predict-leak"; // FastAPI ML service
  const REQUEST_TIMEOUT = 1200;

  /** Fetch with timeout, rejects fast instead of hanging the UI. */
  async function safeFetch(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function loadLocalJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }

  /** Derive live "leak" events from ward mock data (severity from status). */
  function deriveLeaksFromWards(wards) {
    return wards
      .filter(w => w.status === "critical" || w.status === "warning")
      .map(w => ({
        location: w.area,
        ward: w.ward,
        severity: w.status === "critical" ? "critical" : "warning",
        probability: w.status === "critical" ? 92 + Math.round(Math.random() * 7) : 55 + Math.round(Math.random() * 20),
        pressureDrop: w.status === "critical" ? 45 : 22,
        estimatedLossLpm: w.status === "critical" ? 250 : 90,
        assignedTeam: w.status === "critical" ? "Team 04" : "Team 02",
        lat: w.lat,
        lng: w.lng
      }));
  }

  async function getSensors() {
    try {
      return await safeFetch(`${BASE_URL}/sensors`);
    } catch (err) {
      return loadLocalJSON("sensors.json");
    }
  }

  async function getWardData() {
    try {
      return await safeFetch(`${BASE_URL}/wards`);
    } catch (err) {
      return loadLocalJSON("wards.json");
    }
  }

  async function getLeaks() {
    try {
      return await safeFetch(`${BASE_URL}/leaks`);
    } catch (err) {
      const wards = await loadLocalJSON("wards.json");
      return deriveLeaksFromWards(wards);
    }
  }

  async function getTankLevels() {
    try {
      return await safeFetch(`${BASE_URL}/tank-levels`);
    } catch (err) {
      return [
        { id: "T01", area: "Dwaraka Nagar", level: 82, capacity: "5 ML" },
        { id: "T02", area: "MVP Colony", level: 34, capacity: "3 ML" },
        { id: "T03", area: "Gajuwaka", level: 91, capacity: "8 ML" },
        { id: "T04", area: "Madhurawada", level: 58, capacity: "4 ML" }
      ];
    }
  }

  async function getMaintenanceStatus() {
    try {
      return await safeFetch(`${BASE_URL}/maintenance`);
    } catch (err) {
      return [
        { id: "M-241", area: "MVP Colony", task: "Pipeline joint repair", status: "in-progress", eta: "2h 10m" },
        { id: "M-242", area: "Seethammadhara", task: "Valve pressure check", status: "scheduled", eta: "Tomorrow" },
        { id: "M-239", area: "Madhurawada", task: "Sensor recalibration", status: "in-progress", eta: "45m" }
      ];
    }
  }

  /**
   * Calls the ML backend (FastAPI + Random Forest/XGBoost/LSTM) for a
   * leak-risk prediction. Falls back to a lightweight heuristic when the
   * ML service is unreachable, so the AI Predictions panel never breaks.
   * @param {{pressure:number, flow:number, pipe_age:number, acoustic?:number, weather?:string}} payload
   */
  async function predictLeak(payload) {
    try {
      return await safeFetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Heuristic fallback so the UI still demonstrates the feature offline.
      const pressureFactor = Math.max(0, (5.5 - payload.pressure) / 5.5);
      const ageFactor = Math.min(1, (payload.pipe_age || 0) / 40);
      const flowFactor = Math.max(0, (payload.flow - 60) / 140);
      const risk = Math.round(Math.min(99, (pressureFactor * 55 + ageFactor * 30 + flowFactor * 15)));
      return { risk, status: risk >= 75 ? "critical" : risk >= 40 ? "warning" : "safe", source: "offline-heuristic" };
    }
  }

  return { getSensors, getWardData, getLeaks, getTankLevels, getMaintenanceStatus, predictLeak };
})();
