<template>
  <div class="form-container">
    <form class="armor-upgrade-form form">
      <div class="form-input">
        <label class="form-input__label">
          Стоимость +0 предмета
          <input class="form-input__input" type="number" v-model="itemPrice" />
        </label>
      </div>
      <div class="form-input">
        <label class="form-input__label">
          Цена Elunium
          <input class="form-input__input" type="number" v-model="eluPrice" />
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
          <span class="form-input__label-text">Использовать Enriched Elunium c заточки на...</span>
          <select class="form-input__input" v-model="enrichedEluUsedFrom">
            <option :value="-1">Не использовать</option>
            <option v-for="level in possibleEnrichedEluUpgradeLevels" :value="level" :key="level">
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input" v-show="enrichEluUsed">
        <label class="form-input__label">
          Цена Enriched Elunium
          <input class="form-input__input" type="number" v-model="enrichedEluPrice" />
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
        <span class="form-calculation-result__key">Elunium'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${eluRequiredCount}, стоимость ${formatNumberWithDots(eluCost)}`
        }}</span>
      </div>
      <div class="form-calculation-result" v-show="enrichEluUsed">
        <span class="form-calculation-result__key">Enriched Elunium'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${enrichedEluRequiredCount}, стоимость ${formatNumberWithDots(enrichedEluCost)}`
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
  armorUpgradeData,
  npcUpgradePriceWithEnrichedMaterial
} from '@/utils/upgrade/constants';
import {
  calculateRequiredUpgradeMaterials,
  calculateUpgradeAttempts,
  formatNumberWithDots,
  roundToDecimalPlace
} from '@/utils/upgrade/calculations';

const itemPrice = ref(900000);
const eluPrice = ref(9000);
const enrichedEluPrice = ref(2500000);
const upgradeUntil = ref(0);
const enrichedEluUsedFrom = ref(-1);

const enrichEluUsed = computed(() => {
  return enrichedEluUsedFrom.value !== -1;
});

const upgradeUntilIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === upgradeUntil.value);
});

const enrichedEluUsedFromIndex = computed(() => {
  return upgradeLevels.findIndex((x) => x === enrichedEluUsedFrom.value);
});

const eluUpgradeProbabilities = computed(() => {
  if (!enrichEluUsed.value) {
    return armorUpgradeData.probabilities.npc.slice(0, upgradeUntilIndex.value + 1);
  }
  return armorUpgradeData.probabilities.npc.slice(0, enrichedEluUsedFromIndex.value);
});
const enrichedEluUpgradeProbabilities = computed(() => {
  if (!enrichEluUsed.value) {
    return [];
  }
  return armorUpgradeData.probabilities.npcWithEnrichedElu.slice(
    enrichedEluUsedFromIndex.value,
    upgradeUntilIndex.value + 1
  );
});

const upgradeProbabilities = computed(() => {
  return [...eluUpgradeProbabilities.value, ...enrichedEluUpgradeProbabilities.value];
});

const itemsRequiredCount = computed(() => {
  return calculateUpgradeAttempts(upgradeProbabilities.value);
});

const possibleEnrichedEluUpgradeLevels = computed(() => {
  const firstRiskyUpgradeLevel = 5;
  if (upgradeUntil.value < firstRiskyUpgradeLevel) {
    return [];
  }
  const firstRiskyUpgradeLevelIndex = upgradeLevels.findIndex((x) => x === firstRiskyUpgradeLevel);
  return upgradeLevels.slice(firstRiskyUpgradeLevelIndex, upgradeUntilIndex.value + 1);
});

const eluRequiredCount = computed(() => {
  return calculateRequiredUpgradeMaterials(eluUpgradeProbabilities.value);
});

const enrichedEluRequiredCount = computed(() => {
  return calculateRequiredUpgradeMaterials(enrichedEluUpgradeProbabilities.value);
});

const itemCost = computed(() => {
  return roundToDecimalPlace(itemsRequiredCount.value * itemPrice.value, 0);
});

const eluCost = computed(() => {
  return roundToDecimalPlace(eluRequiredCount.value * eluPrice.value, 0);
});

const enrichedEluCost = computed(() => {
  return roundToDecimalPlace(enrichedEluRequiredCount.value * enrichedEluPrice.value, 0);
});

const npcComission = computed(() => {
  const eluComission = eluRequiredCount.value * armorUpgradeData.npcUpgradePrice;
  const erichedEluComission = enrichedEluRequiredCount.value * npcUpgradePriceWithEnrichedMaterial;
  return roundToDecimalPlace(eluComission + erichedEluComission, 0);
});

const totalUpgradeCost = computed(() => {
  return roundToDecimalPlace(
    itemCost.value + eluCost.value + enrichedEluCost.value + npcComission.value,
    0
  );
});

watch(upgradeUntil, (newVal) => {
  if (!enrichEluUsed.value) {
    return;
  }
  if (newVal < enrichedEluUsedFrom.value) {
    enrichedEluUsedFrom.value = -1;
  }
});
</script>

<style scoped lang="scss"></style>
