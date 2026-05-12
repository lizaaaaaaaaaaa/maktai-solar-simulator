const startBtn = document.getElementById("startBtn");
const simulateBtn = document.getElementById("simulateBtn");
const formSection = document.getElementById("formSection");
const resultSection = document.getElementById("resultSection");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    formSection.scrollIntoView({ behavior: "smooth" });
  });
}

if (simulateBtn) {
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

    updateSummary(result);
    updateBreakdown(result);
    updateV2HExplanation(result);
    renderGenerationChart(result.monthlyGeneration);
    renderV2HCompareChart(result);
    renderCompareTable(result);

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
  });
}

function updateSummary(result) {
  document.getElementById("annualGeneration").textContent = formatKwh(result.annualGeneration);
  document.getElementById("annualBenefit").textContent = formatYen(result.benefitWithV2H);
  document.getElementById("benefit15Years").textContent = formatYen(result.benefit15YearsWithV2H);
  document.getElementById("v2hScore").textContent = result.v2hFit;
}

function updateBreakdown(result) {
  document.getElementById("selfConsumptionBenefit").textContent = formatYen(result.selfConsumptionBenefit);
  document.getElementById("sellIncome").textContent = formatYen(result.sellIncome);
  document.getElementById("batteryBenefit").textContent = formatYen(result.batteryBenefit);
  document.getElementById("v2hAdditionalBenefit").textContent = formatYen(result.v2hAdditionalBenefit);
}

function updateV2HExplanation(result) {
  document.getElementById("v2hExplanation").textContent = result.v2hExplanation;
}

function renderCompareTable(result) {
  const tbody = document.getElementById("compareTable");

  const v2hEffectLabel =
    result.evStatus === "no"
      ? "EV未所有のため対象外"
      : formatYen(result.v2hAdditionalBenefit);

  const disasterWithoutV2H =
    result.disasterLevel >= 4 ? "中" : "標準";

  const disasterWithV2H =
    result.v2hFit === "高" ? "高" :
    result.v2hFit === "中" ? "中〜高" :
    "低〜中";

  const v2hComment =
    result.evStatus === "no"
      ? "EV未所有のため効果算出対象外"
      : result.v2hAdditionalBenefit > 0
        ? "EV活用による追加効果あり"
        : "条件により要確認";

  const rows = [
    ["年間メリット", formatYen(result.benefitWithoutV2H), formatYen(result.benefitWithV2H)],
    ["15年累計効果", formatYen(result.benefit15YearsWithoutV2H), formatYen(result.benefit15YearsWithV2H)],
    ["V2H追加効果", "-", v2hEffectLabel],
    ["V2H評価コメント", "蓄電池中心の活用", v2hComment],
    ["推奨蓄電池容量", result.recommendedBattery, result.recommendedBattery],
    ["災害対策評価", disasterWithoutV2H, disasterWithV2H],
    ["補助金反映", "未反映", "未反映"]
  ];

  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    </tr>
  `).join("");
}