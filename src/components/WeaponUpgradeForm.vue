<template>
  <div class="form-container">
    <form class="weapon-upgrade-form form">
      <div class="form-input">
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
          Стоимость +0 предмета
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
          <span class="form-input__label-text">Использовать Enriched Oridecon c заточки на...</span>
          <select class="form-input__input" v-model="enrichedOriUsedFrom">
            <option :value="-1">Не использовать</option>
            <option v-for="level in possibleEnrichedOriUpgradeLevels" :value="level" :key="level">
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input" v-show="enrichOriUsed">
        <label class="form-input__label">
          Цена Enriched Oridecon
          <input class="form-input__input" type="number" v-model="enrichedOriPrice" />
        </label>
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
      <div class="form-calculation-result" v-show="enrichOriUsed">
        <span class="form-calculation-result__key">Enriched Oridecon'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${enrichedOriRequiredCount}, стоимость ${formatNumberWithDots(enrichedOriCost)}`
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
  upgradeMaterials
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

const itemPrice = ref(900000);
const materialPrice = ref(0);
const weaponLevel = ref(1);
const enrichedOriPrice = ref(2500000);
const upgradeUntil = ref(0);
const enrichedOriUsedFrom = ref(-1);

const upgradeLevelData = computed<WeaponUpgradeLevelData>(() => {
  const levelKey = ('lvl' + weaponLevel.value) as keyof WeaponUpgradeData;
  return weaponUpgradeData[levelKey];
});

const upgradeMaterial = computed<UpgradeMaterial | null>(() => {
  return upgradeMaterials.find((m) => m.id === upgradeLevelData.value.materialId) ?? null;
});

const upgradeMaterialName = computed(() => {
  return upgradeMaterial.value?.name ?? '';
});

const enrichOriUsed = computed(() => {
  return enrichedOriUsedFrom.value !== -1;
});

const upgradeUntilIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === upgradeUntil.value);
});

const enrichedOriUsedFromIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === enrichedOriUsedFrom.value);
});

const defaultMaterialUpgradeProbabilities = computed(() => {
  if (!enrichOriUsed.value) {
    return upgradeLevelData.value.probabilities.npc.slice(0, upgradeUntilIndex.value + 1);
  }
  return upgradeLevelData.value.probabilities.npc.slice(0, enrichedOriUsedFromIndex.value);
});
const enrichedOriUpgradeProbabilities = computed(() => {
  if (!enrichOriUsed.value) {
    return [];
  }
  return upgradeLevelData.value.probabilities.npcWithEnrichedOri.slice(
    enrichedOriUsedFromIndex.value,
    upgradeUntilIndex.value + 1
  );
});

const upgradeProbabilities = computed(() => {
  return [...defaultMaterialUpgradeProbabilities.value, ...enrichedOriUpgradeProbabilities.value];
});

const itemsRequiredCount = computed(() => {
  return calculateUpgradeAttempts(upgradeProbabilities.value);
});

const firstRiskyUpgradeLevel = computed(() => {
  return defaultMaterialUpgradeProbabilities.value.reduce((acc, x) => (x === 1 ? acc + 1 : acc), 1);
});

const possibleEnrichedOriUpgradeLevels = computed(() => {
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

const enrichedOriRequiredCount = computed(() => {
  return calculateRequiredUpgradeMaterials(enrichedOriUpgradeProbabilities.value);
});

const itemCost = computed(() => {
  return roundToDecimalPlace(itemsRequiredCount.value * itemPrice.value, 0);
});

const defaultUpgradeMaterialCost = computed(() => {
  return roundToDecimalPlace(defaultUpgradeMaterialRequiredCount.value * materialPrice.value, 0);
});

const enrichedOriCost = computed(() => {
  return roundToDecimalPlace(enrichedOriRequiredCount.value * enrichedOriPrice.value, 0);
});

const npcComission = computed(() => {
  const defaultUpgradeMaterialComission =
    defaultUpgradeMaterialRequiredCount.value * upgradeLevelData.value.npcUpgradePrice;
  const erichedOriComission = enrichedOriRequiredCount.value * npcUpgradePriceWithEnrichedMaterial;
  return roundToDecimalPlace(defaultUpgradeMaterialComission + erichedOriComission, 0);
});

const totalUpgradeCost = computed(() => {
  return roundToDecimalPlace(
    itemCost.value + defaultUpgradeMaterialCost.value + enrichedOriCost.value + npcComission.value,
    0
  );
});

watch(upgradeUntil, (newVal) => {
  if (!enrichOriUsed.value) {
    return;
  }
  if (newVal < enrichedOriUsedFrom.value) {
    enrichedOriUsedFrom.value = -1;
  }
});

watch(
  upgradeMaterial,
  (newVal) => {
    materialPrice.value = newVal?.price ?? 0;
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
