import type ArmorUpgradeData from '@/interfaces/ArmorUpgradeData';
import type WeaponUpgradeData from '@/interfaces/WeaponUpgradeData';
import type UpgradeMaterial from '@/interfaces/UpgradeMaterial';

const upgradeLevels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const weaponLevels: number[] = [1, 2, 3, 4];
const npcUpgradePriceWithEnrichedMaterial = 20000;

const armorUpgradeData: ArmorUpgradeData = {
  probabilities: {
    npc: [1, 1, 1, 1, 0.6, 0.4, 0.4, 0.2, 0.2, 0.1],
    npcWithEnrichedElu: [1, 1, 1, 1, 0.84, 0.64, 0.64, 0.36, 0.36, 0.19]
  },
  npcUpgradePrice: 2000,
  materialId: 'elu'
};

const upgradeMaterials: UpgradeMaterial[] = [
  {
    id: 'elu',
    name: 'Elunium',
    price: 0,
    imageName: 'elu.gif'
  },
  {
    id: 'enriched-elu',
    name: 'Enriched Elunium',
    price: 0,
    imageName: 'enriched-elu.gif'
  },
  {
    id: 'pha',
    name: 'Pharcon',
    price: 200,
    imageName: 'pharcon.gif'
  },
  {
    id: 'emv',
    name: 'Emveretarcon',
    price: 1000,
    imageName: 'emver.gif'
  },
  {
    id: 'ori',
    name: 'Oridecon',
    price: 0,
    imageName: 'ori.gif'
  },
  {
    id: 'enriched-ori',
    name: 'Enriched Oridecon',
    price: 0,
    imageName: 'enriched-ori.gif'
  }
];

const weaponUpgradeData: WeaponUpgradeData = {
  lvl1: {
    probabilities: {
      npc: [1, 1, 1, 1, 1, 1, 1, 0.6, 0.4, 0.2],
      whiteSmith: [1, 1, 1, 1, 1, 1, 1, 0.7, 0.5, 0.3],
      npcWithEnrichedOri: [1, 1, 1, 1, 1, 1, 1, 0.84, 0.64, 0.36],
      whiteSmithWithEnrichedOri: [1, 1, 1, 1, 1, 1, 1, 0.86, 0.66, 0.38]
    },
    npcUpgradePrice: 50,
    materialId: 'pha'
  },
  lvl2: {
    probabilities: {
      npc: [1, 1, 1, 1, 1, 1, 0.6, 0.4, 0.2, 0.2],
      whiteSmith: [1, 1, 1, 1, 1, 1, 0.7, 0.5, 0.3, 0.3],
      npcWithEnrichedOri: [1, 1, 1, 1, 1, 1, 0.84, 0.64, 0.36, 0.36],
      whiteSmithWithEnrichedOri: [1, 1, 1, 1, 1, 1, 0.86, 0.66, 0.38, 0.38]
    },
    npcUpgradePrice: 200,
    materialId: 'emv'
  },
  lvl3: {
    probabilities: {
      npc: [1, 1, 1, 1, 1, 0.6, 0.5, 0.2, 0.2, 0.2],
      whiteSmith: [1, 1, 1, 1, 1, 0.7, 0.6, 0.3, 0.3, 0.3],
      npcWithEnrichedOri: [1, 1, 1, 1, 1, 0.84, 0.75, 0.36, 0.36, 0.36],
      whiteSmithWithEnrichedOri: [1, 1, 1, 1, 1, 0.86, 0.77, 0.38, 0.38, 0.38]
    },
    npcUpgradePrice: 5000,
    materialId: 'ori'
  },
  lvl4: {
    probabilities: {
      npc: [1, 1, 1, 1, 0.6, 0.4, 0.4, 0.2, 0.2, 0.1],
      whiteSmith: [1, 1, 1, 1, 0.7, 0.5, 0.5, 0.3, 0.3, 0.2],
      npcWithEnrichedOri: [1, 1, 1, 1, 0.84, 0.64, 0.64, 0.36, 0.36, 0.19],
      whiteSmithWithEnrichedOri: [1, 1, 1, 1, 0.86, 0.66, 0.66, 0.38, 0.38, 0.21]
    },
    npcUpgradePrice: 20000,
    materialId: 'ori'
  }
};

export {
  armorUpgradeData,
  weaponUpgradeData,
  npcUpgradePriceWithEnrichedMaterial,
  upgradeLevels,
  upgradeMaterials,
  weaponLevels
};
