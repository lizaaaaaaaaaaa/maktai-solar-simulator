let generationChartInstance = null;
let v2hCompareChartInstance = null;

function renderGenerationChart(monthlyGeneration) {
  const ctx = document.getElementById("generationChart");

  if (generationChartInstance) {
    generationChartInstance.destroy();
  }

  generationChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: [
        {
          label: "月別発電量（kWh）",
          data: monthlyGeneration
        }
      ]
    },
    options: {
      responsive: true,
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
          beginAtZero: true
        }
      }
    }
  });
}

function renderV2HCompareChart(result) {
  const ctx = document.getElementById("v2hCompareChart");

  if (v2hCompareChartInstance) {
    v2hCompareChartInstance.destroy();
  }

  v2hCompareChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["年間メリット", "15年累計効果"],
      datasets: [
        {
          label: "V2Hなし",
          data: [result.benefitWithoutV2H, result.benefit15YearsWithoutV2H]
        },
        {
          label: "V2Hあり",
          data: [result.benefitWithV2H, result.benefit15YearsWithV2H]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
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
          beginAtZero: true
        }
      }
    }
  });
}