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
            <option v-for="level in allUpgradeLevels" :value="level" :key="level">
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
      <div class="form-input" v-if="enrichEluUsed">
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
          `${itemsRequired}, стоимость ${formatNumberWithDots(itemsRequiredPrice)}`
        }}</span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">Elunium'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${eluRequired}, стоимость ${formatNumberWithDots(eluRequiredPrice)}`
        }}</span>
      </div>
      <div class="form-calculation-result" v-if="enrichEluUsed">
        <span class="form-calculation-result__key">Enriched Elunium'ов понадобится:</span>
        <span class="form-calculation-result__value">{{
          `${enrichedEluRequired}, стоимость ${formatNumberWithDots(enrichedEluRequiredPrice)}`
        }}</span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">Общая стоимость:</span>
        <span class="form-calculation-result__value">{{
          formatNumberWithDots(totalUpgradePrice)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { armorUpgradeData } from '@/utils/upgrade/constants';
import {
  calculateRequiredUpgradeMaterials,
  calculateUpgradeAttempts,
  formatNumberWithDots,
  roundToDecimalPlace
} from '@/utils/upgrade/calculations';

const allUpgradeLevels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const itemPrice = ref(900000);
const eluPrice = ref(9000);
const enrichedEluPrice = ref(2500000);
const upgradeUntil = ref(0);
const enrichedEluUsedFrom = ref(-1);

const enrichEluUsed = computed(() => {
  return enrichedEluUsedFrom.value !== -1;
});

const upgradeUntilIndex = computed(() => {
  return allUpgradeLevels.findIndex((x) => x === upgradeUntil.value);
});

const enrichedEluUsedFromIndex = computed(() => {
  return allUpgradeLevels.findIndex((x) => x === enrichedEluUsedFrom.value);
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

const itemsRequired = computed(() => {
  return calculateUpgradeAttempts(upgradeProbabilities.value);
});

const possibleEnrichedEluUpgradeLevels = computed(() => {
  const firstRiskyUpgradeLevel = 5;
  if (upgradeUntil.value < firstRiskyUpgradeLevel) {
    return [];
  }
  const firstRiskyUpgradeLevelIndex = allUpgradeLevels.findIndex(
    (x) => x === firstRiskyUpgradeLevel
  );
  return allUpgradeLevels.slice(firstRiskyUpgradeLevelIndex, upgradeUntilIndex.value + 1);
});

const eluRequired = computed(() => {
  return calculateRequiredUpgradeMaterials(eluUpgradeProbabilities.value);
});

const enrichedEluRequired = computed(() => {
  return calculateRequiredUpgradeMaterials(enrichedEluUpgradeProbabilities.value);
});

const itemsRequiredPrice = computed(() => {
  return roundToDecimalPlace(itemsRequired.value * itemPrice.value, 0);
});

const eluRequiredPrice = computed(() => {
  return roundToDecimalPlace(eluRequired.value * eluPrice.value, 0);
});

const enrichedEluRequiredPrice = computed(() => {
  return roundToDecimalPlace(enrichedEluRequired.value * enrichedEluPrice.value, 0);
});

const totalUpgradePrice = computed(() => {
  return roundToDecimalPlace(
    itemsRequiredPrice.value + eluRequiredPrice.value + enrichedEluRequiredPrice.value,
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
