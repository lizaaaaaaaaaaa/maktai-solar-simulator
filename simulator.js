const AREA_FACTOR = {
  tokyo: 1.0,
  kansai: 1.02,
  chugoku: 1.04,
  kyushu: 1.08
};

const AREA_LABELS = {
  tokyo: "東京電力エリア",
  kansai: "関西電力エリア",
  chugoku: "中国電力エリア",
  kyushu: "九州電力エリア"
};

const POWER_PLANS = {
  tokyo: {
    standard: {
      label: "従量電灯B・標準的なプラン",
      buyPrice: 35,
      note: "標準的な電力単価として試算"
    },
    smart: {
      label: "スタンダードS相当",
      buyPrice: 34,
      note: "一般家庭向けプランの参考値として試算"
    },
    night: {
      label: "スマートライフ系・夜間活用プラン",
      buyPrice: 32,
      note: "夜間電力活用を想定した参考値として試算"
    }
  },
  kansai: {
    standard: {
      label: "従量電灯A・標準的なプラン",
      buyPrice: 34,
      note: "標準的な電力単価として試算"
    },
    value: {
      label: "なっトクでんき相当",
      buyPrice: 33,
      note: "一般家庭向けプランの参考値として試算"
    },
    denka: {
      label: "はぴeタイム系・オール電化プラン",
      buyPrice: 31,
      note: "オール電化向けの参考値として試算"
    }
  },
  chugoku: {
    standard: {
      label: "従量電灯A・標準的なプラン",
      buyPrice: 34,
      note: "標準的な電力単価として試算"
    },
    value: {
      label: "ぐっとずっと。プラン相当",
      buyPrice: 33,
      note: "一般家庭向けプランの参考値として試算"
    },
    denka: {
      label: "電化Styleコース相当",
      buyPrice: 31,
      note: "オール電化向けの参考値として試算"
    }
  },
  kyushu: {
    standard: {
      label: "従量電灯B・標準的なプラン",
      buyPrice: 34,
      note: "標準的な電力単価として試算"
    },
    family: {
      label: "スマートファミリープラン相当",
      buyPrice: 33,
      note: "一般家庭向けプランの参考値として試算"
    },
    night: {
      label: "電化でナイト・セレクト相当",
      buyPrice: 31,
      note: "夜間電力活用を想定した参考値として試算"
    }
  }
};

const SELL_PRICE = {
  post_fit: 8,
  soon: 10,
  active: 16,
  unknown: 10,
  no_solar: 0
};

const SELL_STATUS_LABELS = {
  post_fit: "すでに売電価格が下がっている",
  soon: "数年以内に売電価格が下がる予定",
  active: "まだ固定価格で売電できている",
  unknown: "わからない",
  no_solar: "太陽光を設置していない"
};

const DAYTIME_HOME_LABELS = {
  high: "多い",
  middle: "普通",
  low: "少ない"
};

const EV_STATUS_LABELS = {
  yes: "持っている",
  planned: "購入予定あり",
  no: "持っていない"
};

const DISASTER_LABELS = {
  low: "低い",
  middle: "普通",
  high: "高い"
};

const DISASTER_SCORE = {
  low: 1,
  middle: 3,
  high: 5
};

const MONTHLY_BILL_LABELS = {
  8000: "〜8,000円",
  12000: "8,000〜12,000円",
  18000: "12,000〜18,000円",
  25000: "18,000〜25,000円",
  30000: "25,000円以上"
};

const SOLAR_LABELS = {
  0: "未設置・不明",
  3: "3.0kW",
  4: "4.0kW",
  5: "5.0kW",
  6: "6.0kW",
  7: "7.0kW",
  8: "8.0kW以上"
};

const SELF_CONSUMPTION_RATE = {
  high: 0.45,
  middle: 0.35,
  low: 0.28
};

const BATTERY_UP_RATE = {
  high: 0.12,
  middle: 0.17,
  low: 0.22
};

function calculateSimulation(input) {
  const solarKw = Number(input.solarKw);
  const areaFactor = AREA_FACTOR[input.area] || 1.0;

  const selectedPlan = getSelectedPowerPlan(input.area, input.powerPlan);
  const buyPrice = selectedPlan.buyPrice;

  const sellPrice = SELL_PRICE[input.sellStatus] ?? 10;

  const annualGeneration = Math.max(0, Math.round(solarKw * areaFactor * 1050));

  const selfRate = SELF_CONSUMPTION_RATE[input.daytimeHome] || 0.35;
  const batteryUpRate = BATTERY_UP_RATE[input.daytimeHome] || 0.17;

  const selfConsumptionBenefit = Math.round(annualGeneration * selfRate * buyPrice);
  const sellIncome = Math.round(annualGeneration * (1 - selfRate) * sellPrice);
  const batteryBenefit = Math.round(annualGeneration * batteryUpRate * buyPrice);

  const disasterScore = DISASTER_SCORE[input.disasterLevel] || 3;

  const evFactor =
    input.evStatus === "yes" ? 1 :
    input.evStatus === "planned" ? 0.6 :
    0;

  let v2hAdditionalBenefit = 0;

  if (solarKw > 0 && evFactor > 0) {
    v2hAdditionalBenefit = Math.round(evFactor * solarKw * disasterScore * 8000);
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
    disasterScore
  });

  const recommendedBattery = getRecommendedBattery(solarKw);

  const v2hExplanation = getV2HExplanation({
    solarKw,
    evStatus: input.evStatus,
    disasterScore,
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
    area: input.area,
    powerPlan: input.powerPlan,
    monthlyBill: input.monthlyBill,
    sellStatus: input.sellStatus,
    daytimeHome: input.daytimeHome,
    evStatus: input.evStatus,
    disasterLevel: input.disasterLevel,
    disasterScore,
    selectedPlan
  };
}

function getSelectedPowerPlan(area, planKey) {
  const areaPlans = POWER_PLANS[area] || POWER_PLANS.chugoku;
  return areaPlans[planKey] || Object.values(areaPlans)[0];
}

function getV2HFit({ solarKw, evStatus, disasterScore }) {
  if (solarKw <= 0) {
    return "低";
  }

  if (evStatus === "yes" && solarKw >= 4 && disasterScore >= 5) {
    return "高";
  }

  if ((evStatus === "yes" || evStatus === "planned") && solarKw >= 3 && disasterScore >= 3) {
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

function getV2HExplanation({ solarKw, evStatus, disasterScore, v2hFit, v2hAdditionalBenefit }) {
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
    return `EVを所有しており、太陽光容量と停電対策の重要度も高いため、V2Hとの相性は高めです。概算のV2H追加効果は年間${formatYen(v2hAdditionalBenefit)}です。ただし、導入費用も上がりやすいため、経済効果だけでなく防災価値も含めて検討するのがおすすめです。`;
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