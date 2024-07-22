import type WeaponUpgradeProbabilities from './WeaponUpgradeProbabilities';

export default interface WeaponUpgradeLevelData {
  probabilities: WeaponUpgradeProbabilities;
  npcUpgradePrice: number;
  defaultMaterialId: string;
  enrichedMaterialId: string;
}
