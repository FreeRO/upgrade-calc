<template>
  <div class="form-container">
    <form class="weapon-upgrade-form form">
      <div class="form-input" v-if="isWeaponItemTypeSelected">
        <label class="form-input__label">
          <span class="form-input__label-text">Уровень оружия</span>
          <select class="form-input__input" v-model="weaponLevel">
            <option v-for="level in weaponLevels" :value="level" :key="level">
              {{ level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input">
        <label class="form-input__label">
          <span class="form-input__label-text">Стоимость +0 предмета</span>
          <input class="form-input__input" type="number" v-model="itemPrice" />
        </label>
      </div>
      <div class="form-input">
        <label class="form-input__label">
          {{ `Цена ${upgradeMaterialName}'a` }}
          <input class="form-input__input" type="number" v-model="materialPrice" />
        </label>
      </div>
      <div class="form-input">
        <label class="form-input__label">
          <span class="form-input__label-text">Заточить до</span>
          <select class="form-input__input" v-model="upgradeUntil">
            <option value="0">Не выбрано</option>
            <option v-for="level in upgradeLevels" :value="level" :key="level">
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input">
        <label class="form-input__label">
          <span class="form-input__label-text"
            >Использовать {{ enrichedMaterialName }} c заточки на...</span
          >
          <select class="form-input__input" v-model="enrichedMaterialUsedFrom">
            <option :value="-1">Не использовать</option>
            <option
              v-for="level in possibleEnrichedMaterialUpgradeLevels"
              :value="level"
              :key="level"
            >
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input" v-show="enrichedMaterialUsed">
        <label class="form-input__label">
          <span class="form-input__label-text">Цена {{ enrichedMaterialName }}</span>
          <input class="form-input__input" type="number" v-model="enrichedMaterialPrice" />
        </label>
      </div>
      <div class="form-input" v-show="isWeaponItemTypeSelected">
        <span class="form-input__label-text">Кто точит</span>
        <div class="form-input__radio-button-container">
          <label class="form-input__radio-button-label">
            <span class="form-input__radio-button-label-text">NPC</span>
            <input class="form-input__input" type="radio" v-model="upgradeMethod" :value="'npc'" />
          </label>
          <label class="form-input__radio-button-label">
            <span class="form-input__radio-button-label-text">White Smith 70 job lvl</span>
            <input
              class="form-input__input"
              type="radio"
              v-model="upgradeMethod"
              :value="'whiteSmith'"
            />
          </label>
        </div>
      </div>
    </form>
    <div class="form-calculation-results">
      <div class="form-calculation-results__title">Итого</div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">Вещей понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${itemsRequiredCount}, стоимость ${formatNumberWithDots(itemCost)}`
        }}</span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">{{
          `${upgradeMaterialName}'ов понадобится:`
        }}</span>
        <span class="form-calculation-result__value">{{
          `${defaultUpgradeMaterialRequiredCount}, стоимость ${formatNumberWithDots(defaultUpgradeMaterialCost)}`
        }}</span>
      </div>
      <div class="form-calculation-result" v-show="enrichedMaterialUsed">
        <span class="form-calculation-result__key">Enriched Oridecon'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${enrichedMaterialRequiredCount}, стоимость ${formatNumberWithDots(enrichedMaterialCost)}`
        }}</span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">Комиссия NPC:</span>
        <span class="form-calculation-result__value">
          {{ formatNumberWithDots(npcComission) }}
        </span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">Общая стоимость:</span>
        <span class="form-calculation-result__value">{{
          formatNumberWithDots(totalUpgradeCost)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  upgradeLevels,
  weaponUpgradeData,
  npcUpgradePriceWithEnrichedMaterial,
  weaponLevels,
  upgradeMaterials,
  type UpgradeItemType,
  armorUpgradeData
} from '@/utils/upgrade/constants';
import {
  calculateRequiredUpgradeMaterials,
  calculateUpgradeAttempts,
  formatNumberWithDots,
  roundToDecimalPlace
} from '@/utils/upgrade/calculations';
import type WeaponUpgradeData from '@/interfaces/WeaponUpgradeData';
import type WeaponUpgradeLevelData from '@/interfaces/WeaponUpgradeLevelData';
import type UpgradeMaterial from '@/interfaces/UpgradeMaterial';
import type ArmorUpgradeData from '@/interfaces/ArmorUpgradeData';

type UpgradeMethod = 'npc' | 'whiteSmith';

const { upgradeItemType } = defineProps<{
  upgradeItemType: UpgradeItemType;
}>();
const itemPrice = ref(900000);
const materialPrice = ref(0);
const weaponLevel = ref(1);
const enrichedMaterialPrice = ref(2500000);
const upgradeUntil = ref(0);
const enrichedMaterialUsedFrom = ref(-1);
const upgradeMethod = ref<UpgradeMethod>('npc');

const isArmorItemTypeSelected = computed(() => upgradeItemType === 'armor');
const isWeaponItemTypeSelected = computed(() => upgradeItemType === 'weapon');
const isWhiteSmithUpgradeMethodSelected = computed(() => upgradeMethod.value === 'whiteSmith');

const enrichedMaterial = computed<UpgradeMaterial | null>(() => {
  if (isArmorItemTypeSelected.value) {
    return upgradeMaterials.find((m) => m.id === 'enriched-elu') ?? null;
  }
  return upgradeMaterials.find((m) => m.id === 'enriched-ori') ?? null;
});

const enrichedMaterialName = computed(() => {
  return enrichedMaterial.value?.name ?? '';
});

const upgradeData = computed<WeaponUpgradeLevelData | ArmorUpgradeData>(() => {
  if (isArmorItemTypeSelected.value) {
    return armorUpgradeData;
  }
  const levelKey = ('lvl' + weaponLevel.value) as keyof WeaponUpgradeData;
  return weaponUpgradeData[levelKey];
});

const upgradeMaterial = computed<UpgradeMaterial | null>(() => {
  return upgradeMaterials.find((m) => m.id === upgradeData.value.materialId) ?? null;
});

const upgradeMaterialName = computed(() => {
  return upgradeMaterial.value?.name ?? '';
});

const enrichedMaterialUsed = computed(() => {
  return enrichedMaterialUsedFrom.value !== -1;
});

const upgradeUntilIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === upgradeUntil.value);
});

const enrichedMaterialUsedFromIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === enrichedMaterialUsedFrom.value);
});

const defaultMaterialUpgradeProbabilities = computed(() => {
  const npcProbabilities = upgradeData.value.probabilities.npc;
  const sliceIndex = enrichedMaterialUsed.value
    ? enrichedMaterialUsedFromIndex.value
    : upgradeUntilIndex.value + 1;

  if (isArmorItemTypeSelected.value) {
    return npcProbabilities.slice(0, sliceIndex);
  }

  const whiteSmithProbabilities = (upgradeData.value as WeaponUpgradeLevelData).probabilities
    .whiteSmith;
  if (isWhiteSmithUpgradeMethodSelected.value) {
    return whiteSmithProbabilities.slice(0, sliceIndex);
  }

  return npcProbabilities.slice(0, sliceIndex);
});

const enrichedMaterialUpgradeProbabilities = computed(() => {
  if (!enrichedMaterialUsed.value) {
    return [];
  }
  if (isArmorItemTypeSelected.value) {
    return (upgradeData.value as ArmorUpgradeData).probabilities.npcWithEnrichedElu.slice(
      enrichedMaterialUsedFromIndex.value,
      upgradeUntilIndex.value + 1
    );
  }
  if (isWhiteSmithUpgradeMethodSelected.value) {
    return (
      upgradeData.value as WeaponUpgradeLevelData
    ).probabilities.whiteSmithWithEnrichedOri.slice(
      enrichedMaterialUsedFromIndex.value,
      upgradeUntilIndex.value + 1
    );
  }
  return (upgradeData.value as WeaponUpgradeLevelData).probabilities.npcWithEnrichedOri.slice(
    enrichedMaterialUsedFromIndex.value,
    upgradeUntilIndex.value + 1
  );
});

const upgradeProbabilities = computed(() => {
  return [
    ...defaultMaterialUpgradeProbabilities.value,
    ...enrichedMaterialUpgradeProbabilities.value
  ];
});

const itemsRequiredCount = computed(() => {
  return calculateUpgradeAttempts(upgradeProbabilities.value);
});

const firstRiskyUpgradeLevel = computed(() => {
  return defaultMaterialUpgradeProbabilities.value.reduce((acc, x) => (x === 1 ? acc + 1 : acc), 1);
});

const possibleEnrichedMaterialUpgradeLevels = computed(() => {
  if (upgradeUntil.value < firstRiskyUpgradeLevel.value) {
    return [];
  }
  const firstRiskyUpgradeLevelIndex = upgradeLevels.findIndex(
    (x) => x === firstRiskyUpgradeLevel.value
  );
  return upgradeLevels.slice(firstRiskyUpgradeLevelIndex, upgradeUntilIndex.value + 1);
});

const defaultUpgradeMaterialRequiredCount = computed(() => {
  return calculateRequiredUpgradeMaterials(defaultMaterialUpgradeProbabilities.value);
});

const enrichedMaterialRequiredCount = computed(() => {
  return calculateRequiredUpgradeMaterials(enrichedMaterialUpgradeProbabilities.value);
});

const itemCost = computed(() => {
  return roundToDecimalPlace(itemsRequiredCount.value * itemPrice.value, 0);
});

const defaultUpgradeMaterialCost = computed(() => {
  return roundToDecimalPlace(defaultUpgradeMaterialRequiredCount.value * materialPrice.value, 0);
});

const enrichedMaterialCost = computed(() => {
  return roundToDecimalPlace(enrichedMaterialRequiredCount.value * enrichedMaterialPrice.value, 0);
});

const npcComission = computed(() => {
  const defaultUpgradeMaterialComission =
    defaultUpgradeMaterialRequiredCount.value * upgradeData.value.npcUpgradePrice;
  const erichedOriComission =
    enrichedMaterialRequiredCount.value * npcUpgradePriceWithEnrichedMaterial;
  return roundToDecimalPlace(defaultUpgradeMaterialComission + erichedOriComission, 0);
});

const totalUpgradeCost = computed(() => {
  return roundToDecimalPlace(
    itemCost.value +
      defaultUpgradeMaterialCost.value +
      enrichedMaterialCost.value +
      npcComission.value,
    0
  );
});

watch(upgradeUntil, (newVal) => {
  if (!enrichedMaterialUsed.value) {
    return;
  }
  if (newVal < enrichedMaterialUsedFrom.value) {
    enrichedMaterialUsedFrom.value = -1;
  }
});

watch(
  upgradeMaterial,
  (newVal) => {
    materialPrice.value = newVal?.price ?? 0;
  },
  { immediate: true }
);

watch(
  enrichedMaterial,
  (newVal) => {
    enrichedMaterialPrice.value = newVal?.price ?? 0;
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
