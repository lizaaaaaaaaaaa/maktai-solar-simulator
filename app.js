const startBtn = document.getElementById("startBtn");
const simulateBtn = document.getElementById("simulateBtn");
const formSection = document.getElementById("formSection");
const resultSection = document.getElementById("resultSection");

startBtn.addEventListener("click", () => {
  formSection.classList.remove("hidden");
  formSection.scrollIntoView({ behavior: "smooth" });
});

simulateBtn.addEventListener("click", () => {
  const input = {
    solarKw: document.getElementById("solarKw").value,
    area: document.getElementById("area").value,
    monthlyBill: document.getElementById("monthlyBill").value,
    fitStatus: document.getElementById("fitStatus").value,
    daytimeHome: document.getElementById("daytimeHome").value,
    evStatus: document.getElementById("evStatus").value,
    disasterLevel: document.getElementById("disasterLevel").value
  };

  const result = calculateSimulation(input);

  document.getElementById("annualGeneration").textContent = formatKwh(result.annualGeneration);
  document.getElementById("annualBenefit").textContent = formatYen(result.benefitWithV2H);
  document.getElementById("benefit15Years").textContent = formatYen(result.benefit15YearsWithV2H);
  document.getElementById("v2hScore").textContent = result.v2hFit;

  renderGenerationChart(result.monthlyGeneration);
  renderV2HCompareChart(result);
  renderCompareTable(result);

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth" });
});

function renderCompareTable(result) {
  const tbody = document.getElementById("compareTable");

  const rows = [
    ["年間メリット", formatYen(result.benefitWithoutV2H), formatYen(result.benefitWithV2H)],
    ["15年累計効果", formatYen(result.benefit15YearsWithoutV2H), formatYen(result.benefit15YearsWithV2H)],
    ["V2H追加効果", "-", formatYen(result.v2hAdditionalBenefit)],
    ["推奨蓄電池容量", result.recommendedBattery, result.recommendedBattery],
    ["災害対策評価", "中", result.v2hFit === "高" ? "高" : "中"],
    ["補助金反映", "未反映", "未反映"]
  ];

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    </tr>
  `).join("");
}