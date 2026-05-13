const AREA_FACTOR = {
  tohoku: 0.95,
  tokyo: 1.0,
  hokuriku: 0.96,
  chubu: 1.03,
  kansai: 1.02,
  chugoku: 1.04,
  shikoku: 1.06,
  kyushu: 1.08
};

const AREA_LABELS = {
  tohoku: "東北電力",
  tokyo: "東京電力",
  hokuriku: "北陸電力",
  chubu: "中部電力",
  kansai: "関西電力",
  chugoku: "中国電力",
  shikoku: "四国電力",
  kyushu: "九州電力"
};

const POWER_PLANS = {
  tohoku: {
    standard_b: { label: "従量電灯B", buyPrice: 35 },
    enet_value: { label: "よりそう＋eねっとバリュー", buyPrice: 34 },
    family_value: { label: "よりそう＋ファミリーバリュー相当", buyPrice: 34 },
    night_holiday: { label: "よりそう＋ナイト＆ホリデー相当", buyPrice: 32 },
    smart_time: { label: "よりそう＋スマートタイム相当", buyPrice: 32 }
  },
  tokyo: {
    standard_b: { label: "従量電灯B", buyPrice: 36 },
    standard_c: { label: "従量電灯C相当", buyPrice: 36 },
    standard_s: { label: "スタンダードS相当", buyPrice: 35 },
    premium_s: { label: "プレミアムS相当", buyPrice: 34 },
    smart_life: { label: "スマートライフ系", buyPrice: 33 }
  },
  hokuriku: {
    standard: { label: "従量電灯", buyPrice: 33 },
    next: { label: "従量電灯ネクスト相当", buyPrice: 32 },
    erai_tokutoku: { label: "節電とくとく電灯相当", buyPrice: 32 },
    night12: { label: "くつろぎナイト12", buyPrice: 30 }
  },
  chubu: {
    standard_b: { label: "従量電灯B", buyPrice: 29 },
    point: { label: "ポイントプラン相当", buyPrice: 28 },
    otoku: { label: "おとくプラン相当", buyPrice: 28 },
    tokutoku: { label: "とくとくプラン相当", buyPrice: 28 },
    smart_life: { label: "スマートライフプラン", buyPrice: 27 },
    smart_life_morning: { label: "スマートライフプラン 朝とく相当", buyPrice: 27 },
    smart_life_night: { label: "スマートライフプラン 夜とく相当", buyPrice: 27 }
  },
  kansai: {
    standard_a: { label: "従量電灯A", buyPrice: 36 },
    standard_b: { label: "従量電灯B相当", buyPrice: 36 },
    nattoku: { label: "なっトクでんき相当", buyPrice: 34 },
    with_point: { label: "withポイント でんき相当", buyPrice: 34 },
    hapie_r: { label: "はぴeタイムR", buyPrice: 32 }
  },
  chugoku: {
    standard_a: { label: "従量電灯A", buyPrice: 34 },
    standard_b: { label: "従量電灯B相当", buyPrice: 34 },
    value: { label: "ぐっとずっと。プラン相当", buyPrice: 33 },
    smart_course: { label: "スマートコース相当", buyPrice: 33 },
    denka: { label: "電化Styleコース", buyPrice: 31 }
  },
  shikoku: {
    standard_a: { label: "従量電灯A", buyPrice: 37 },
    standard_b: { label: "従量電灯B相当", buyPrice: 37 },
    value: { label: "おトクeプラン相当", buyPrice: 35 },
    denka_e: { label: "でんかeプラン", buyPrice: 34 },
    smart_e: { label: "スマートeプラン相当", buyPrice: 34 }
  },
  kyushu: {
    standard_b: { label: "従量電灯B", buyPrice: 27 },
    standard_c: { label: "従量電灯C相当", buyPrice: 27 },
    smart_family: { label: "スマートファミリープラン相当", buyPrice: 26 },
    jikan_tai: { label: "時間帯別電灯相当", buyPrice: 25 },
    night_select_21: { label: "電化でナイト・セレクト21", buyPrice: 24 },
    night_select_22: { label: "電化でナイト・セレクト22", buyPrice: 24 },
    night_select_23: { label: "電化でナイト・セレクト23", buyPrice: 24 }
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

const V2H_UTILIZATION_RATE = {
  high: 0.26,
  middle: 0.20,
  low: 0.14
};

const V2H_DISASTER_VALUE = {
  low: 5000,
  middle: 12000,
  high: 20000
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

  const surplusRate = Math.max(0, 1 - selfRate);
  const surplusGeneration = annualGeneration * surplusRate;

  const selfConsumptionBenefit = Math.round(annualGeneration * selfRate * buyPrice);
  const sellIncome = Math.round(surplusGeneration * sellPrice);
  const batteryBenefit = Math.round(annualGeneration * batteryUpRate * buyPrice);

  const disasterScore = DISASTER_SCORE[input.disasterLevel] || 3;

  const v2hAdditionalBenefit = calculateV2HAdditionalValue({
    solarKw,
    annualGeneration,
    surplusGeneration,
    buyPrice,
    sellPrice,
    evStatus: input.evStatus,
    disasterLevel: input.disasterLevel
  });

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

function calculateV2HAdditionalValue({
  solarKw,
  annualGeneration,
  surplusGeneration,
  buyPrice,
  sellPrice,
  evStatus,
  disasterLevel
}) {
  if (solarKw <= 0 || evStatus === "no") {
    return 0;
  }

  const evFactor = evStatus === "yes" ? 1 : 0.55;
  const utilizationRate = V2H_UTILIZATION_RATE[disasterLevel] || 0.2;
  const chargeDischargeEfficiency = 0.85;
  const disasterValue = V2H_DISASTER_VALUE[disasterLevel] || 12000;

  const effectiveUnitValue = Math.max(0, buyPrice - sellPrice);
  const usableEnergy = surplusGeneration * utilizationRate * evFactor;

  const energyValue = usableEnergy * effectiveUnitValue * chargeDischargeEfficiency;
  const adjustedDisasterValue = disasterValue * evFactor;

  return Math.round(energyValue + adjustedDisasterValue);
}

function getSelectedPowerPlan(area, planKey) {
  const areaPlans = POWER_PLANS[area] || POWER_PLANS.chugoku;
  return areaPlans[planKey] || Object.values(areaPlans)[0];
}

function getV2HFit({ solarKw, evStatus, disasterScore }) {
  if (solarKw <= 0) return "低";

  if (evStatus === "yes" && solarKw >= 4 && disasterScore >= 5) {
    return "高";
  }

  if ((evStatus === "yes" || evStatus === "planned") && solarKw >= 3 && disasterScore >= 3) {
    return "中";
  }

  return "低";
}

function getRecommendedBattery(solarKw) {
  if (solarKw <= 0) return "要確認";
  if (solarKw >= 7) return "10〜12kWh";
  if (solarKw >= 5) return "7〜10kWh";
  if (solarKw >= 3) return "5〜7kWh";
  return "要確認";
}

function getV2HExplanation({ solarKw, evStatus, disasterScore, v2hFit, v2hAdditionalBenefit }) {
  if (solarKw <= 0) {
    return "太陽光容量が未設置・不明のため、V2Hによる発電電力の活用効果は概算しにくい状態です。まずは太陽光の有無や容量を確認したうえで、蓄電池やV2Hの適合性を判断するのがおすすめです。";
  }

  if (evStatus === "no") {
    return "EVを所有していないため、現時点ではV2Hの追加価値は見込みにくい状態です。V2HはEVのバッテリーを家庭側で活用する仕組みのため、EV購入予定が出てきた段階で再検討すると判断しやすくなります。";
  }

  if (evStatus === "planned") {
    return `EV購入予定があるため、V2Hは将来的な検討候補になります。現在の条件ではV2H適合度は「${v2hFit}」です。V2H追加価値の目安は年間${formatYen(v2hAdditionalBenefit)}です。実際の効果は車種、利用頻度、充放電設定により変動します。`;
  }

  if (evStatus === "yes" && v2hFit === "高") {
    return `EVを所有しており、太陽光容量と停電対策の重要度も高いため、V2Hとの相性は高めです。V2H追加価値の目安は年間${formatYen(v2hAdditionalBenefit)}です。ただし、導入費用も上がりやすいため、経済効果だけでなく防災価値も含めて検討するのがおすすめです。`;
  }

  return `現在の条件では、V2H適合度は「${v2hFit}」です。V2H追加価値の目安は年間${formatYen(v2hAdditionalBenefit)}です。V2HはEV活用や停電対策に有効ですが、太陽光容量・EV利用頻度・導入費用によって効果が変わります。`;
}

function createMonthlyGeneration(annualGeneration) {
  const monthlyRatio = [
    0.0588,
    0.0735,
    0.0882,
    0.1029,
    0.1127,
    0.0931,
    0.1078,
    0.1029,
    0.0833,
    0.0735,
    0.0588,
    0.0445
  ];

  const monthlyGeneration = monthlyRatio.map((ratio) =>
    Math.round(annualGeneration * ratio)
  );

  const total = monthlyGeneration.reduce((sum, value) => sum + value, 0);
  const diff = annualGeneration - total;

  monthlyGeneration[11] += diff;

  return monthlyGeneration;
}

function formatYen(value) {
  return `${Number(value).toLocaleString()}円`;
}

function formatKwh(value) {
  return `${Number(value).toLocaleString()}kWh`;
}