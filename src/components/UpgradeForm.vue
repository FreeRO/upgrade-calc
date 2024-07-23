<template>
  <div class="form-container">
    <form class="upgrade-form">
      <div class="input-wrapper">
        <div class="input-label">
          <span class="input-label__text">Тип предмета</span>
          <div class="button-group" role="group">
            <button
              class="button"
              :class="{ selected: isArmorItemTypeSelected }"
              type="button"
              role="button"
              @click="selectUpgradeItemType('armor')"
            >
              <div class="button__img-wrapper">
                <img
                  class="button__img"
                  src="../assets/images/icon-armor.gif"
                  alt="Armor icon"
                  width="24"
                  height="24"
                />
              </div>
              <span class="button__text">Броня</span>
            </button>
            <button
              class="button"
              :class="{ selected: isWeaponItemTypeSelected }"
              type="button"
              role="button"
              @click="selectUpgradeItemType('weapon')"
            >
              <div class="button__img-wrapper">
                <img
                  class="button__img"
                  src="../assets/images/icon-weapon.gif"
                  alt="Weapon icon"
                  width="24"
                  height="24"
                />
              </div>
              <span class="button__text">Оружие</span>
            </button>
          </div>
        </div>
      </div>
      <div class="input-wrapper" v-if="isWeaponItemTypeSelected">
        <label class="input-label">
          <span class="input-label__text">Уровень оружия</span>
          <select class="form-input" v-model="weaponLevel">
            <option v-for="level in weaponLevels" :value="level" :key="level">
              {{ level }}
            </option>
          </select>
        </label>
      </div>
      <div class="input-wrapper">
        <label class="input-label">
          <span class="input-label__text">Стоимость +0 предмета</span>
          <input class="form-input" type="number" v-model="itemPrice" />
        </label>
      </div>
      <div class="input-wrapper">
        <label class="input-label">
          <span class="input-label__text">
            Цена
            <UpgradeMaterialTag
              :image-url="defaultMaterialImageUrl"
              :material-name="defaultMaterialName"
            />'a
          </span>
          <input
            class="form-input"
            type="number"
            v-model="defaultMaterialPrice"
            @blur="saveDefaultMaterialPriceToLocalStorage"
          />
        </label>
      </div>
      <div class="input-wrapper" v-show="isWeaponItemTypeSelected">
        <div class="input-label">
          <span class="input-label__text">Кто точит</span>
          <div class="button-group" role="group">
            <button
              class="button"
              :class="{ selected: isNpcUpgradeMethodSelected }"
              type="button"
              role="button"
              @click="selectUpgradeMethod('npc')"
            >
              <div v-if="showUpgradeMethodImages" class="button__img-wrapper refine-method">
                <img
                  class="button__img"
                  src="../assets/images/refine-master.png"
                  alt="mastersmith icon"
                  width="31"
                  height="50"
                />
              </div>
              <span class="button__text">NPC</span>
            </button>
            <button
              :class="{ selected: isWhiteSmithUpgradeMethodSelected }"
              type="button"
              role="button"
              @click="selectUpgradeMethod('whiteSmith')"
            >
              <div v-if="showUpgradeMethodImages" class="button__img-wrapper refine-method">
                <img
                  class="button__img"
                  src="../assets/images/mastersmith.png"
                  alt="mastersmith icon"
                  width="21"
                  height="50"
                />
              </div>
              <span class="button__text">Mastersmith Job Lv. 70</span>
            </button>
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <label class="input-label">
          <span class="input-label__text">Заточка до</span>
          <select class="form-input" v-model="upgradeUntil">
            <option value="0">Не выбрано</option>
            <option v-for="level in upgradeLevels" :value="level" :key="level">
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="input-wrapper input-desktop" v-show="isEnrichedMaterialUsagePossible">
        <div class="input-label">
          <span class="input-label__text">
            Использовать
            <UpgradeMaterialTag
              :image-url="enrichedMaterialImageUrl"
              :material-name="enrichedMaterialName"
            />
            c заточки на...</span
          >
          <div class="button-group" role="group">
            <button
              :class="{ selected: enrichedMaterialUsedFrom === -1 }"
              :key="-1"
              type="button"
              role="button"
              @click="selectEnrichedMaterialUsedFrom(-1)"
            >
              Не использовать
            </button>
            <button
              class="reduced-horizontal-padding"
              :class="{ selected: enrichedMaterialUsedFrom === level }"
              v-for="level in possibleEnrichedMaterialUpgradeLevels"
              :value="level"
              :key="level"
              type="button"
              role="button"
              @click="selectEnrichedMaterialUsedFrom(level)"
            >
              {{ '+' + level }}
            </button>
          </div>
        </div>
      </div>
      <div class="input-wrapper input-mobile" v-if="isEnrichedMaterialUsagePossible">
        <label class="input-label">
          <span class="input-label__text">
            Использовать
            <UpgradeMaterialTag
              :image-url="enrichedMaterialImageUrl"
              :material-name="enrichedMaterialName"
            />
            c заточки на...
          </span>
          <select class="form-input" v-model="enrichedMaterialUsedFrom">
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
      <div class="input-wrapper" v-show="isEnrichedMaterialUsed">
        <label class="input-label">
          <span class="input-label__text">
            Цена
            <UpgradeMaterialTag
              :image-url="enrichedMaterialImageUrl"
              :material-name="enrichedMaterialName"
            />
          </span>
          <input
            class="form-input"
            type="number"
            v-model="enrichedMaterialPrice"
            @blur="saveEnrichedMaterialPriceToLocalStorage"
          />
        </label>
      </div>
    </form>
    <div class="form-calculation-results-wrapper">
      <div class="form-calculation-results">
        <div class="form-calculation-results__title">Средняя стоимость заточки</div>
        <div class="form-calculation-results__total-cost">
          {{ formatNumberWithDots(totalUpgradeCost) }}
        </div>
        <div class="divider"></div>
        <div class="form-calculation-result">
          <div class="form-calculation-result-key">
            <img
              v-if="isArmorItemTypeSelected"
              class="form-calculation-result-key__image"
              src="../assets/images/icon-armor.gif"
              alt="Armor icon"
              width="24"
              height="24"
            />
            <img
              v-if="isWeaponItemTypeSelected"
              class="form-calculation-result-key__image"
              src="../assets/images/icon-weapon.gif"
              alt="Weapon icon"
              width="24"
              height="24"
            />
            <div class="form-calculation-result-key__multiplier-icon"></div>
            <span>
              {{ itemsRequiredCount }}
            </span>
          </div>
          <span class="form-calculation-result__value">{{ formatNumberWithDots(itemCost) }}</span>
        </div>
        <div class="form-calculation-result">
          <span class="form-calculation-result-key">
            <img
              v-if="defaultMaterialImageUrl"
              :src="defaultMaterialImageUrl"
              :alt="defaultMaterialName + ' icon'"
              width="24"
              height="24"
              class="form-calculation-result-key__image"
            />
            <div class="form-calculation-result-key__multiplier-icon"></div>
            <span>
              {{ defaultMaterialRequiredCount }}
            </span>
          </span>
          <span class="form-calculation-result__value">{{
            formatNumberWithDots(defaultMaterialCost)
          }}</span>
        </div>
        <div class="form-calculation-result" v-if="isEnrichedMaterialUsed">
          <span class="form-calculation-result-key">
            <img
              v-if="enrichedMaterialImageUrl"
              :src="enrichedMaterialImageUrl"
              :alt="enrichedMaterialName + ' icon'"
              width="24"
              height="24"
              class="form-calculation-result-key__image"
            />
            <div class="form-calculation-result-key__multiplier-icon"></div>
            <span>
              {{ enrichedMaterialRequiredCount }}
            </span>
          </span>
          <span class="form-calculation-result__value">{{
            formatNumberWithDots(enrichedMaterialCost)
          }}</span>
        </div>
        <div
          class="form-calculation-result"
          v-if="isArmorItemTypeSelected || isNpcUpgradeMethodSelected"
        >
          <span class="form-calculation-result-key">Комиссия NPC</span>
          <span class="form-calculation-result__value">
            {{ formatNumberWithDots(npcComission) }}
          </span>
        </div>
      </div>
      <div class="form-calculation-results__note">
        Таблицы с шансами см. на
        <a
          href="https://wiki.free-ro.com/%D0%97%D0%B0%D1%82%D0%BE%D1%87%D0%BA%D0%B0"
          target="_blank"
          >FreeRo Wiki - Заточка</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UpgradeMaterialTag from '@/components/UpgradeMaterialTag.vue';
import {
  upgradeLevels,
  weaponUpgradeData,
  npcUpgradePriceWithEnrichedMaterial,
  weaponLevels,
  upgradeMaterials,
  armorUpgradeData
} from '@/utils/upgrade/constants';
import {
  calculateCombinedUpgradeMaterials,
  calculateUpgradeAttempts,
  formatNumberWithDots,
  roundToDecimalPlace
} from '@/utils/upgrade/calculations';
import type WeaponUpgradeData from '@/interfaces/WeaponUpgradeData';
import type WeaponUpgradeLevelData from '@/interfaces/WeaponUpgradeLevelData';
import type UpgradeMaterial from '@/interfaces/UpgradeMaterial';
import type ArmorUpgradeData from '@/interfaces/ArmorUpgradeData';
import type RequiredUpgradeMaterials from '@/interfaces/RequiredUpgradeMaterials';
import type MaterialPrice from '@/interfaces/local-storage/MaterialPrice';
import type CalculatorSettings from '@/interfaces/local-storage/CalculatorSettings';

type UpgradeItemType = 'armor' | 'weapon';
type UpgradeMethod = 'npc' | 'whiteSmith';

const selectedUpgradeItemType = ref<UpgradeItemType>('armor');
const itemPrice = ref(900000);
const defaultMaterialPrice = ref(0);
const weaponLevel = ref(1);
const enrichedMaterialPrice = ref(0);
const upgradeUntil = ref(0);
const enrichedMaterialUsedFrom = ref(-1);
const upgradeMethod = ref<UpgradeMethod>('npc');
const showUpgradeMethodImages = ref(false);

const isArmorItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'armor');
const isWeaponItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'weapon');
const isNpcUpgradeMethodSelected = computed(() => upgradeMethod.value === 'npc');
const isWhiteSmithUpgradeMethodSelected = computed(() => upgradeMethod.value === 'whiteSmith');

const upgradeData = computed<WeaponUpgradeLevelData | ArmorUpgradeData>(() => {
  if (isArmorItemTypeSelected.value) {
    return armorUpgradeData;
  }
  const levelKey = ('lvl' + weaponLevel.value) as keyof WeaponUpgradeData;
  return weaponUpgradeData[levelKey];
});

const enrichedMaterial = computed<UpgradeMaterial | null>(() => {
  return upgradeMaterials.find((m) => m.id === upgradeData.value.enrichedMaterialId) ?? null;
});

const enrichedMaterialName = computed(() => {
  return enrichedMaterial.value?.name ?? '';
});

const enrichedMaterialImageUrl = computed(() => {
  if (!enrichedMaterial.value) {
    return '';
  }
  return new URL(`../assets/images/${enrichedMaterial.value.imageName}`, import.meta.url).href;
});

const defaultMaterial = computed<UpgradeMaterial | null>(() => {
  return upgradeMaterials.find((m) => m.id === upgradeData.value.defaultMaterialId) ?? null;
});

const defaultMaterialName = computed(() => {
  return defaultMaterial.value?.name ?? '';
});

const defaultMaterialImageUrl = computed(() => {
  if (!defaultMaterial.value) {
    return '';
  }
  return new URL(`../assets/images/${defaultMaterial.value.imageName}`, import.meta.url).href;
});

const isEnrichedMaterialUsed = computed(() => {
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
  const sliceIndex = isEnrichedMaterialUsed.value
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
  if (!isEnrichedMaterialUsed.value) {
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

const isEnrichedMaterialUsagePossible = computed(() => {
  return possibleEnrichedMaterialUpgradeLevels.value.length > 0;
});

const requiredUpgradeMaterials = computed<RequiredUpgradeMaterials>(() => {
  return calculateCombinedUpgradeMaterials(
    defaultMaterialUpgradeProbabilities.value,
    enrichedMaterialUpgradeProbabilities.value
  );
});

const defaultMaterialRequiredCount = computed(() => {
  return requiredUpgradeMaterials.value.defaultMaterialCount;
});

const enrichedMaterialRequiredCount = computed(() => {
  return requiredUpgradeMaterials.value.enrichedMaterialCount;
});

const itemCost = computed(() => {
  return roundToDecimalPlace(itemsRequiredCount.value * itemPrice.value, 0);
});

const defaultMaterialCost = computed(() => {
  return roundToDecimalPlace(defaultMaterialRequiredCount.value * defaultMaterialPrice.value, 0);
});

const enrichedMaterialCost = computed(() => {
  return roundToDecimalPlace(enrichedMaterialRequiredCount.value * enrichedMaterialPrice.value, 0);
});

const npcComission = computed(() => {
  if (isWeaponItemTypeSelected.value && isWhiteSmithUpgradeMethodSelected.value) {
    return 0;
  }
  const defaultMaterialComission =
    defaultMaterialRequiredCount.value * upgradeData.value.npcUpgradePrice;
  const erichedMaterialComission =
    enrichedMaterialRequiredCount.value * npcUpgradePriceWithEnrichedMaterial;
  return roundToDecimalPlace(defaultMaterialComission + erichedMaterialComission, 0);
});

const totalUpgradeCost = computed(() => {
  return roundToDecimalPlace(
    itemCost.value + defaultMaterialCost.value + enrichedMaterialCost.value + npcComission.value,
    0
  );
});

function selectUpgradeMethod(method: UpgradeMethod) {
  upgradeMethod.value = method;
}

function selectEnrichedMaterialUsedFrom(upgradeLevel: number) {
  enrichedMaterialUsedFrom.value = upgradeLevel;
}

function selectUpgradeItemType(type: UpgradeItemType) {
  selectedUpgradeItemType.value = type;
}

function saveMaterialPriceToLocalStorage(materialPrice: MaterialPrice) {
  const materialPrices = getMaterialPricesFromLocalStorage();
  const priceToUpdate = materialPrices.find((mp) => mp.id === materialPrice.id);
  if (priceToUpdate) {
    priceToUpdate.price = materialPrice.price;
  } else {
    materialPrices.push(materialPrice);
  }
  try {
    localStorage.setItem('materialPrices', JSON.stringify(materialPrices));
  } catch (error) {
    console.error('Invalid JSON for material prices', error);
  }
}

function saveEnrichedMaterialPriceToLocalStorage() {
  if (!enrichedMaterial.value) {
    return;
  }
  const materialPrice: MaterialPrice = {
    id: enrichedMaterial.value?.id,
    price: enrichedMaterialPrice.value
  };
  saveMaterialPriceToLocalStorage(materialPrice);
}

function saveDefaultMaterialPriceToLocalStorage() {
  if (!defaultMaterial.value) {
    return;
  }
  const materialPrice: MaterialPrice = {
    id: defaultMaterial.value?.id,
    price: defaultMaterialPrice.value
  };
  saveMaterialPriceToLocalStorage(materialPrice);
}

function getMaterialPricesFromLocalStorage() {
  const materialPricesString = localStorage.getItem('materialPrices');
  const materialPrices = materialPricesString
    ? (JSON.parse(materialPricesString) as MaterialPrice[])
    : [];
  return materialPrices;
}

function getMaterialPriceFromLocalStorageById(id: string) {
  const materialPrices = getMaterialPricesFromLocalStorage();
  const materialPrice = materialPrices.find((mp) => mp.id === id);
  return materialPrice?.price ?? null;
}

function resetForm() {
  itemPrice.value = 0;
  defaultMaterialPrice.value = 0;
  weaponLevel.value = 1;
  enrichedMaterialPrice.value = 0;
  upgradeUntil.value = 0;
  enrichedMaterialUsedFrom.value = -1;
  upgradeMethod.value = 'npc';
}

watch(selectedUpgradeItemType, () => {
  resetForm();
});

watch(upgradeUntil, (newVal) => {
  if (!isEnrichedMaterialUsed.value) {
    return;
  }
  if (newVal < enrichedMaterialUsedFrom.value) {
    enrichedMaterialUsedFrom.value = -1;
  }
});

watch(
  defaultMaterial,
  (newVal) => {
    if (!newVal) {
      return;
    }
    const price = getMaterialPriceFromLocalStorageById(newVal.id);
    defaultMaterialPrice.value = price ?? newVal.price;
  },
  { immediate: true }
);

watch(
  enrichedMaterial,
  (newVal) => {
    if (!newVal) {
      return;
    }
    const price = getMaterialPriceFromLocalStorageById(newVal.id);
    enrichedMaterialPrice.value = price ?? newVal.price;
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.upgrade-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 3rem;
  width: 100%;
  flex-shrink: 0;
  margin-bottom: 2rem;
}

.form-calculation-results-wrapper {
  flex-grow: 1;
}

.form-calculation-results {
  background-color: var(--color-card-bg);
  padding: 1rem 1.5rem;
  padding-bottom: 1rem;
  margin-bottom: auto;
  width: 100%;
  border-radius: var(--c-border-radius-medium);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--box-shadow-card);
  margin-bottom: 1rem;

  &__title {
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
  }
  &__total-cost {
    width: 100%;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-accent);
    word-break: break-all;
  }
  &__subtitle {
    font-size: 0.9rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
  }
  &__note {
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
  }
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-card-border);
  margin-bottom: 1.85rem;
}

.form-calculation-result {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.7rem;

  &__value {
    font-weight: 500;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
}

.form-calculation-result-key {
  display: flex;
  align-items: center;
  margin-right: 0.3rem;
  &__image {
    margin-right: 0.3rem;
  }
  &__multiplier-icon {
    width: 0.8rem;
    height: 0.8rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M6 6 L18 18 M6 18 L18 6" stroke="%232A2D33" stroke-width="2" stroke-linecap="round"/></svg>');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-right: 0.3rem;
  }
}

.dark .form-calculation-result-key {
  &__multiplier-icon {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M6 6 L18 18 M6 18 L18 6" stroke="%23e5e7eb" stroke-width="2" stroke-linecap="round"/></svg>');
  }
}

@media (min-width: 1100px) {
  .form-container {
    flex-direction: row;
  }
  .upgrade-form {
    width: 55%;
    margin-bottom: 0;
  }
  .form-calculation-results {
    padding: 1.5rem 2rem;
    padding-bottom: 1.5rem;
    &__total-cost {
      font-size: 2.25rem;
    }
  }
}
</style>
