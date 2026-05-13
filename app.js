const startBtn = document.getElementById("startBtn");
const simulateBtn = document.getElementById("simulateBtn");
const formSection = document.getElementById("formSection");
const resultSection = document.getElementById("resultSection");
const areaSelect = document.getElementById("area");
const powerPlanSelect = document.getElementById("powerPlan");

document.addEventListener("DOMContentLoaded", () => {
  populatePowerPlans(areaSelect.value);
});

if (areaSelect) {
  areaSelect.addEventListener("change", () => {
    populatePowerPlans(areaSelect.value);
  });
}

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
      powerPlan: document.getElementById("powerPlan").value,
      monthlyBill: document.getElementById("monthlyBill").value,
      sellStatus: document.getElementById("sellStatus").value,
      daytimeHome: document.getElementById("daytimeHome").value,
      evStatus: document.getElementById("evStatus").value,
      disasterLevel: document.getElementById("disasterLevel").value
    };

    const result = calculateSimulation(input);

    updateSelectedConditions(result);
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

function populatePowerPlans(area) {
  const plans = POWER_PLANS[area] || POWER_PLANS.chugoku;

  powerPlanSelect.innerHTML = Object.entries(plans)
    .map(([key, plan], index) => {
      const selected = index === 0 ? "selected" : "";
      return `<option value="${key}" ${selected}>${plan.label}</option>`;
    })
    .join("");
}

function updateSelectedConditions(result) {
  document.getElementById("selectedSolarKw").textContent = SOLAR_LABELS[result.solarKw] || `${result.solarKw}kW`;
  document.getElementById("selectedArea").textContent = AREA_LABELS[result.area] || "-";
  document.getElementById("selectedPowerPlan").textContent = result.selectedPlan.label;
  document.getElementById("selectedMonthlyBill").textContent = MONTHLY_BILL_LABELS[result.monthlyBill] || "-";
  document.getElementById("selectedSellStatus").textContent = SELL_STATUS_LABELS[result.sellStatus] || "-";
  document.getElementById("selectedDaytimeHome").textContent = DAYTIME_HOME_LABELS[result.daytimeHome] || "-";
  document.getElementById("selectedEvStatus").textContent = EV_STATUS_LABELS[result.evStatus] || "-";
  document.getElementById("selectedDisasterLevel").textContent = DISASTER_LABELS[result.disasterLevel] || "-";
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

  const v2hValueLabel =
    result.evStatus === "no"
      ? "EV未所有のため対象外"
      : formatYen(result.v2hAdditionalBenefit);

  const disasterWithoutV2H =
    result.disasterScore >= 5 ? "中" : "標準";

  const disasterWithV2H =
    result.v2hFit === "高" ? "高" :
    result.v2hFit === "中" ? "中〜高" :
    "低〜中";

  const v2hComment =
    result.evStatus === "no"
      ? "EV未所有のため効果算出対象外"
      : result.v2hAdditionalBenefit > 0
        ? "EV活用・余剰電力活用の追加価値あり"
        : "条件により要確認";

  const rows = [
    ["年間メリット目安", formatYen(result.benefitWithoutV2H), formatYen(result.benefitWithV2H)],
    ["15年累計効果目安", formatYen(result.benefit15YearsWithoutV2H), formatYen(result.benefit15YearsWithV2H)],
    ["V2H追加価値の目安", "-", v2hValueLabel],
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