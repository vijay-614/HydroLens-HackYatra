/* =========================================================
   HYDROLENSE — charts.js
   Chart.js visualizations: daily leaks, weekly pressure,
   monthly water loss.
   ========================================================= */

const HydroCharts = (() => {
  let dailyChart, weeklyChart, monthlyChart;

  const palette = {
    primary: "#00E5FF",
    safe: "#00C853",
    warning: "#FFC107",
    critical: "#FF3D57",
    grid: "rgba(255,255,255,0.06)",
    text: "#9FB7C8"
  };

  function baseOptions(extra = {}) {
    return Object.assign({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0F2338",
          borderColor: "rgba(0,229,255,0.3)",
          borderWidth: 1,
          titleColor: "#E8F6FB",
          bodyColor: "#9FB7C8",
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: { grid: { color: "transparent" }, ticks: { color: palette.text, font: { size: 10.5 } } },
        y: { grid: { color: palette.grid }, ticks: { color: palette.text, font: { size: 10.5 } }, beginAtZero: true }
      }
    }, extra);
  }

  function initCharts() {
    if (typeof Chart === "undefined") {
      console.warn("HydroLense: Chart.js failed to load — charts will not render.");
      return;
    }

    const dailyCtx = document.getElementById("dailyLeakChart");
    const weeklyCtx = document.getElementById("weeklyPressureChart");
    const monthlyCtx = document.getElementById("monthlyLossChart");
    if (!dailyCtx || !weeklyCtx || !monthlyCtx) return;

    dailyChart = new Chart(dailyCtx, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Leak Events",
          data: [2, 3, 1, 4, 2, 5, 3],
          backgroundColor: "rgba(255,61,87,0.65)",
          borderRadius: 6,
          maxBarThickness: 26
        }]
      },
      options: baseOptions()
    });

    weeklyChart = new Chart(weeklyCtx, {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
        datasets: [{
          label: "Avg Pressure (bar)",
          data: [4.8, 4.6, 4.2, 4.5, 3.9, 4.1],
          borderColor: palette.primary,
          backgroundColor: "rgba(0,229,255,0.12)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: palette.primary
        }]
      },
      options: baseOptions()
    });

    monthlyChart = new Chart(monthlyCtx, {
      type: "bar",
      data: {
        labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Water Loss (kL)",
          data: [180, 210, 165, 240, 300, 265],
          backgroundColor: "rgba(0,229,255,0.55)",
          borderRadius: 6,
          maxBarThickness: 26
        }]
      },
      options: baseOptions()
    });
  }

  /** Push a fresh random-walk data point onto the daily chart (simulated real-time). */
  function pushDailySample(value) {
    if (!dailyChart) return;
    const data = dailyChart.data.datasets[0].data;
    data.shift();
    data.push(value);
    dailyChart.update("none");
  }

  return { initCharts, pushDailySample };
})();
