import type RequiredUpgradeMaterials from '@/interfaces/RequiredUpgradeMaterials';

function calculateUpgradeAttempts(chances: number[]) {
  if (chances.length === 0) {
    return 0;
  }
  const cumulativeChance = chances.reduce((acc, x) => acc * x, 1);
  return roundToDecimalPlace(1 / cumulativeChance, 1);
}

function calculateUpgradeMaterials(upgradeChances: number[]) {
  if (upgradeChances.length === 0) {
    return 0;
  }
  if (upgradeChances.every((x) => x === 1)) {
    return upgradeChances.length;
  }
  const minMaterialPerRiskyUpgrade =
    1 + upgradeChances.reduce((count, num) => (num === 1 ? count + 1 : count), 0);
  const totalUpgradeAttempts = calculateUpgradeAttempts(upgradeChances);
  const minMaterialForFirstRiskyUpgrade = totalUpgradeAttempts * minMaterialPerRiskyUpgrade;

  if (upgradeChances.length === 1) {
    return roundToDecimalPlace(minMaterialForFirstRiskyUpgrade, 1);
  }

  const materialsPerRiskyUpgrade: number[] = [minMaterialForFirstRiskyUpgrade];
  let cumulativeChance = 1;
  for (const [index, chance] of upgradeChances.entries()) {
    if (chance === 1) {
      continue;
    }
    const isLast = index === upgradeChances.length - 1;
    if (isLast) {
      continue;
    }

    cumulativeChance *= chance;
    const materialsRequiredForCurrentChance = totalUpgradeAttempts * cumulativeChance;
    materialsPerRiskyUpgrade.push(materialsRequiredForCurrentChance);
  }
  const totalRequiredMaterials = materialsPerRiskyUpgrade.reduce((acc, x) => acc + x, 0);
  return roundToDecimalPlace(totalRequiredMaterials, 1);
}

function calculateCombinedUpgradeMaterials(defaultChances: number[], enrichedChances: number[]) {
  const totalRequiredMaterials: RequiredUpgradeMaterials = {
    defaultMaterialCount: 0,
    enrichedMaterialCount: 0
  };
  totalRequiredMaterials.defaultMaterialCount = calculateUpgradeMaterials(defaultChances);
  if (enrichedChances.length === 0) {
    return totalRequiredMaterials;
  }
  const enrichedMaterialCount = calculateUpgradeMaterials(enrichedChances);
  const enrichedMaterialUpgradeAttempts = calculateUpgradeAttempts(enrichedChances);
  const adjustedDefaultMaterialCount = roundToDecimalPlace(
    totalRequiredMaterials.defaultMaterialCount * enrichedMaterialUpgradeAttempts,
    1
  );
  totalRequiredMaterials.defaultMaterialCount = adjustedDefaultMaterialCount;
  totalRequiredMaterials.enrichedMaterialCount = enrichedMaterialCount;
  return totalRequiredMaterials;
}

function roundToDecimalPlace(num: number, decimalPlaces: number) {
  const p = Math.pow(10, decimalPlaces);
  const e = Number.EPSILON * num * p;
  return Math.round(num * p + e) / p;
}

function formatNumberWithDots(num: number): string {
  const inputString = num.toString();
  let formattedString = '';
  let count = 0;

  for (let i = inputString.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      formattedString = '.' + formattedString;
    }
    formattedString = inputString[i] + formattedString;
    count++;
  }

  return formattedString + 'z';
}

export {
  calculateUpgradeAttempts,
  calculateCombinedUpgradeMaterials,
  roundToDecimalPlace,
  formatNumberWithDots
};
