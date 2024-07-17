function calculateUpgradeAttempts(chances: number[]) {
  const cumulativeChance = chances.reduce((acc, x) => acc * x, 1);
  return roundToDecimalPlace(1 / cumulativeChance, 1);
}

function calculateRequiredUpgradeMaterials(chances: number[]) {
  if (chances.length === 0) {
    return 0;
  }
  if (chances.every((x) => x === 1)) {
    return chances.length;
  }
  const minimumMaterialAmountSpentOnEachRiskyUpgrade =
    1 + chances.reduce((count, num) => (num === 1 ? count + 1 : count), 0);
  const upgradeAttempts = calculateUpgradeAttempts(chances);
  const minimumMaterialAmountRequiredForFirstRiskyUpgrade =
    upgradeAttempts * minimumMaterialAmountSpentOnEachRiskyUpgrade;

  if (chances.length === 1) {
    return roundToDecimalPlace(minimumMaterialAmountRequiredForFirstRiskyUpgrade, 1);
  }

  const materialsRequiredForEachRiskyUpgrade: number[] = [
    minimumMaterialAmountRequiredForFirstRiskyUpgrade
  ];
  let cumulativeUpgradeChance = 1;
  for (const [index, chance] of chances.entries()) {
    if (chance === 1) {
      continue;
    }
    const isLast = index === chances.length - 1;
    if (isLast) {
      continue;
    }

    cumulativeUpgradeChance *= chance;
    const materialsRequiredForCurrentChance = upgradeAttempts * cumulativeUpgradeChance;
    materialsRequiredForEachRiskyUpgrade.push(materialsRequiredForCurrentChance);
  }
  const requiredUpgradeMaterials = materialsRequiredForEachRiskyUpgrade.reduce(
    (acc, x) => acc + x,
    0
  );
  return roundToDecimalPlace(requiredUpgradeMaterials, 1);
}

function roundToDecimalPlace(num: number, decimalPlaces: number) {
  const p = Math.pow(10, decimalPlaces);
  const e = Number.EPSILON * num * p;
  return Math.round(num * p + e) / p;
}

export { calculateUpgradeAttempts, calculateRequiredUpgradeMaterials, roundToDecimalPlace };
