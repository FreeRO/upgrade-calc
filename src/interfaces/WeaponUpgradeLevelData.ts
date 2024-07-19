import type WeaponUpgradeProbabilities from './WeaponUpgradeProbabilities';

export default interface WeaponUpgradeLevelData {
  probabilities: WeaponUpgradeProbabilities;
  npcUpgradePrice: number;
  materialId: string;
}
