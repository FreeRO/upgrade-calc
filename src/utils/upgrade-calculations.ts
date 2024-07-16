function calculateUpgradeAttempts(chances: number[]) {
  const cumulativeChance = chances.reduce((acc, x) => acc * x, 0)
  return roundToTwo(1 / cumulativeChance)
}

function calculateRequiredUpgradeMaterials() {}

function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100
}

export { calculateUpgradeAttempts }
