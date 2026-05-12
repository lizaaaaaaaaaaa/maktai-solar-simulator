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

  const annualGeneration = Math.max(0, Math.round(solarKw * areaFactor * 1050));

  const selfRate = SELF_CONSUMPTION_RATE[input.daytimeHome] || 0.35;
  const batteryUpRate = BATTERY_UP_RATE[input.daytimeHome] || 0.17;

  const selfConsumptionBenefit = Math.round(annualGeneration * selfRate * buyPrice);
  const sellIncome = Math.round(annualGeneration * (1 - selfRate) * sellPrice);
  const batteryBenefit = Math.round(annualGeneration * batteryUpRate * buyPrice);

  const disasterLevel = Number(input.disasterLevel);

  const evFactor =
    input.evStatus === "yes" ? 1 :
    input.evStatus === "planned" ? 0.6 :
    0;

  let v2hAdditionalBenefit = 0;

  if (solarKw > 0 && evFactor > 0) {
    v2hAdditionalBenefit = Math.round(evFactor * solarKw * disasterLevel * 8000);
  }

  const benefitWithoutV2H = Math.round(
    selfConsumptionBenefit + sellIncome + batteryBenefit
  );

  const benefitWithV2H = Math.round(
    benefitWithoutV2H + v2hAdditionalBenefit
  );

  const benefit15YearsWithoutV2H = benefitWithoutV2H * 15;
  const benefit15YearsWithV2H = benefitWithV2H * 15;

  const v2hFit = getV2HFit({
    solarKw,
    evStatus: input.evStatus,
    disasterLevel
  });

  const recommendedBattery = getRecommendedBattery(solarKw);

  const v2hExplanation = getV2HExplanation({
    solarKw,
    evStatus: input.evStatus,
    disasterLevel,
    v2hFit,
    v2hAdditionalBenefit
  });

  return {
    annualGeneration,
    selfConsumptionBenefit,
    sellIncome,
    batteryBenefit,
    v2hAdditionalBenefit,
    benefitWithoutV2H,
    benefitWithV2H,
    benefit15YearsWithoutV2H,
    benefit15YearsWithV2H,
    v2hFit,
    recommendedBattery,
    v2hExplanation,
    monthlyGeneration: createMonthlyGeneration(annualGeneration),
    solarKw,
    evStatus: input.evStatus,
    disasterLevel
  };
}

function getV2HFit({ solarKw, evStatus, disasterLevel }) {
  if (solarKw <= 0) {
    return "低";
  }

  if (evStatus === "yes" && solarKw >= 4 && disasterLevel >= 4) {
    return "高";
  }

  if ((evStatus === "yes" || evStatus === "planned") && solarKw >= 3 && disasterLevel >= 3) {
    return "中";
  }

  return "低";
}

function getRecommendedBattery(solarKw) {
  if (solarKw <= 0) {
    return "要確認";
  }

  if (solarKw >= 7) {
    return "10〜12kWh";
  }

  if (solarKw >= 5) {
    return "7〜10kWh";
  }

  if (solarKw >= 3) {
    return "5〜7kWh";
  }

  return "要確認";
}

function getV2HExplanation({ solarKw, evStatus, disasterLevel, v2hFit, v2hAdditionalBenefit }) {
  if (solarKw <= 0) {
    return "太陽光容量が未設置・不明のため、V2Hによる発電電力の活用効果は概算しにくい状態です。まずは太陽光の有無や容量を確認したうえで、蓄電池やV2Hの適合性を判断するのがおすすめです。";
  }

  if (evStatus === "no") {
    return "EVを所有していないため、現時点ではV2Hの経済効果は見込みにくい状態です。V2HはEVのバッテリーを家庭側で活用する仕組みのため、EV購入予定が出てきた段階で再検討すると判断しやすくなります。";
  }

  if (evStatus === "planned") {
    return `EV購入予定があるため、V2Hは将来的な検討候補になります。現在の条件ではV2H適合度は「${v2hFit}」です。停電対策を重視する場合は、蓄電池単体だけでなく、EV活用も含めて比較すると判断しやすくなります。`;
  }

  if (evStatus === "yes" && v2hFit === "高") {
    return `EVを所有しており、太陽光容量と停電対策の重視度も高いため、V2Hとの相性は高めです。概算のV2H追加効果は年間${formatYen(v2hAdditionalBenefit)}です。ただし、導入費用も上がりやすいため、経済効果だけでなく防災価値も含めて検討するのがおすすめです。`;
  }

  return `現在の条件では、V2H適合度は「${v2hFit}」です。V2HはEV活用や停電対策に有効ですが、太陽光容量・EV利用頻度・導入費用によって効果が変わります。蓄電池のみの場合と比較しながら検討するのがおすすめです。`;
}

function createMonthlyGeneration(annualGeneration) {
  const monthlyRatio = [
    0.06,
    0.075,
    0.09,
    0.105,
    0.115,
    0.095,
    0.11,
    0.105,
    0.085,
    0.075,
    0.06,
    0.045
  ];

  return monthlyRatio.map((ratio) => Math.round(annualGeneration * ratio));
}

function formatYen(value) {
  return `${Number(value).toLocaleString()}円`;
}

function formatKwh(value) {
  return `${Number(value).toLocaleString()}kWh`;
}