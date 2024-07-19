import type ArmorUpgradeProbabilities from './ArmorUpgradeProbabilities';

export default interface ArmorUpgradeData {
  probabilities: ArmorUpgradeProbabilities;
  npcUpgradePrice: number;
  materialId: string;
}
