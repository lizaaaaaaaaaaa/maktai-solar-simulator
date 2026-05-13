let generationChartInstance = null;
let v2hCompareChartInstance = null;

function renderGenerationChart(monthlyGeneration) {
  const canvas = document.getElementById("generationChart");

  if (!canvas) {
    return;
  }

  if (generationChartInstance) {
    generationChartInstance.destroy();
  }

  generationChartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: [
        {
          label: "月別発電量（kWh）",
          data: monthlyGeneration,
          backgroundColor: "rgba(37, 99, 235, 0.38)",
          borderColor: "rgba(37, 99, 235, 0.72)",
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y.toLocaleString()}kWh`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return `${value.toLocaleString()}`;
            }
          }
        }
      }
    }
  });
}

function renderV2HCompareChart(result) {
  const canvas = document.getElementById("v2hCompareChart");

  if (!canvas) {
    return;
  }

  if (v2hCompareChartInstance) {
    v2hCompareChartInstance.destroy();
  }

  v2hCompareChartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["年間メリット目安", "15年累計効果目安"],
      datasets: [
        {
          label: "V2Hなし",
          data: [result.benefitWithoutV2H, result.benefit15YearsWithoutV2H],
          backgroundColor: "rgba(37, 99, 235, 0.38)",
          borderColor: "rgba(37, 99, 235, 0.72)",
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "V2Hあり",
          data: [result.benefitWithV2H, result.benefit15YearsWithV2H],
          backgroundColor: "rgba(245, 158, 11, 0.42)",
          borderColor: "rgba(245, 158, 11, 0.78)",
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}円`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return `${Number(value).toLocaleString()}円`;
            }
          }
        }
      }
    }
  });
}