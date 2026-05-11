const AREA_FACTOR = {
  hokkaido: 0.92,
  tohoku: 0.95,
  tokyo: 1.0,
  chubu: 1.03,
  kansai: 1.02,
  chugoku: 1.04,
  shikoku: 1.06,
  kyushu: 1.08,
  okinawa: 1.1
};

const SELL_PRICE = {
  post_fit: 8,
  soon: 10,
  active: 16,
  unknown: 10
};

const SELF_CONSUMPTION_RATE = {
  low: 0.28,
  middle: 0.35,
  high: 0.45
};

const BATTERY_UP_RATE = {
  low: 0.22,
  middle: 0.17,
  high: 0.12
};

function calculateSimulation(input) {
  const solarKw = Number(input.solarKw);
  const areaFactor = AREA_FACTOR[input.area] || 1.0;
  const buyPrice = 35;
  const sellPrice = SELL_PRICE[input.fitStatus] || 10;

  const annualGeneration = Math.round(solarKw * areaFactor * 1050);

  const selfRate = SELF_CONSUMPTION_RATE[input.daytimeHome] || 0.35;
  const batteryUpRate = BATTERY_UP_RATE[input.daytimeHome] || 0.17;

  const selfConsumptionBenefit = annualGeneration * selfRate * buyPrice;
  const sellIncome = annualGeneration * (1 - selfRate) * sellPrice;
  const batteryBenefit = annualGeneration * batteryUpRate * buyPrice;

  const disasterLevel = Number(input.disasterLevel);
  const evFactor =
    input.evStatus === "yes" ? 1 :
    input.evStatus === "planned" ? 0.6 :
    0;

  const v2hAdditionalBenefit = Math.round(evFactor * solarKw * disasterLevel * 8000);

  const benefitWithoutV2H = Math.round(selfConsumptionBenefit + sellIncome + batteryBenefit);
  const benefitWithV2H = Math.round(benefitWithoutV2H + v2hAdditionalBenefit);

  const v2hFit =
    evFactor === 1 && solarKw >= 4 && disasterLevel >= 4 ? "高" :
    evFactor > 0 && solarKw >= 3 && disasterLevel >= 3 ? "中" :
    "低";

  const recommendedBattery =
    solarKw >= 7 ? "10〜12kWh" :
    solarKw >= 5 ? "7〜10kWh" :
    solarKw >= 3 ? "5〜7kWh" :
    "要確認";

  return {
    annualGeneration,
    selfConsumptionBenefit: Math.round(selfConsumptionBenefit),
    sellIncome: Math.round(sellIncome),
    batteryBenefit: Math.round(batteryBenefit),
    v2hAdditionalBenefit,
    benefitWithoutV2H,
    benefitWithV2H,
    benefit15YearsWithoutV2H: benefitWithoutV2H * 15,
    benefit15YearsWithV2H: benefitWithV2H * 15,
    v2hFit,
    recommendedBattery,
    monthlyGeneration: createMonthlyGeneration(annualGeneration)
  };
}

function createMonthlyGeneration(annualGeneration) {
  const monthlyRatio = [0.06, 0.075, 0.09, 0.105, 0.115, 0.095, 0.11, 0.105, 0.085, 0.075, 0.06, 0.045];
  return monthlyRatio.map(ratio => Math.round(annualGeneration * ratio));
}

function formatYen(value) {
  return `${Number(value).toLocaleString()}円`;
}

function formatKwh(value) {
  return `${Number(value).toLocaleString()}kWh`;
}