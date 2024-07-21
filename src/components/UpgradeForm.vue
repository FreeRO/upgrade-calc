<template>
  <div class="form-container">
    <form class="upgrade-form">
      <div class="form-input-wrapper">
        <div class="form-input-label">
          <span class="form-input-label__text">Тип предмета</span>
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
      <div class="form-input-wrapper" v-if="isWeaponItemTypeSelected">
        <label class="form-input-label">
          <span class="form-input-label__text">Уровень оружия</span>
          <select class="form-input" v-model="weaponLevel">
            <option v-for="level in weaponLevels" :value="level" :key="level">
              {{ level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input-wrapper">
        <label class="form-input-label">
          <span class="form-input-label__text">Стоимость +0 предмета</span>
          <input class="form-input" type="number" v-model="itemPrice" />
        </label>
      </div>
      <div class="form-input-wrapper">
        <label class="form-input-label">
          <span class="form-input-label__text">
            Цена
            <img
              v-if="defaultUpgradeMaterialImageUrl"
              :src="defaultUpgradeMaterialImageUrl"
              :alt="defaultUpgradeMaterialName + ' icon'"
              width="24"
              height="24"
              class="upgrade-material-image"
            />
            <span class="upgrade-material-name">{{ defaultUpgradeMaterialName }}</span
            >'a
          </span>
          <input
            class="form-input"
            type="number"
            v-model="defaultMaterialPrice"
            @blur="saveDefaultMaterialPriceToLocalStorage"
          />
        </label>
      </div>
      <div class="form-input-wrapper" v-show="isWeaponItemTypeSelected">
        <div class="form-input-label">
          <span class="form-input-label__text">Кто точит</span>
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
      <div class="form-input-wrapper">
        <label class="form-input-label">
          <span class="form-input-label__text">Заточка до</span>
          <select class="form-input" v-model="upgradeUntil">
            <option value="0">Не выбрано</option>
            <option v-for="level in upgradeLevels" :value="level" :key="level">
              {{ '+' + level }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-input-wrapper" v-show="isEnrichedMaterialUsagePossible">
        <div class="form-input-label">
          <span class="form-input-label__text">
            Использовать
            <img
              v-if="enrichedMaterialImageUrl"
              :src="enrichedMaterialImageUrl"
              :alt="enrichedMaterialName + ' icon'"
              width="24"
              height="24"
              class="upgrade-material-image"
            />
            <span class="upgrade-material-name">{{ enrichedMaterialName }}</span>
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
      <div class="form-input-wrapper" v-show="enrichedMaterialUsed">
        <label class="form-input-label">
          <span class="form-input-label__text">
            Цена
            <img
              v-if="enrichedMaterialImageUrl"
              :src="enrichedMaterialImageUrl"
              :alt="enrichedMaterialName + ' icon'"
              width="24"
              height="24"
              class="upgrade-material-image"
            />
            <span class="upgrade-material-name">{{ enrichedMaterialName }}</span></span
          >
          <input
            class="form-input"
            type="number"
            v-model="enrichedMaterialPrice"
            @blur="saveEnrichedMaterialPriceToLocalStorage"
          />
        </label>
      </div>
    </form>
    <div class="form-calculation-results">
      <div class="form-calculation-results__title">Средняя стоимость заточки</div>
      <div class="form-calculation-results__total-cost">
        {{ formatNumberWithDots(totalUpgradeCost) }}
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">
          <img
            v-if="isArmorItemTypeSelected"
            class="form-calculation-result__key-image"
            src="../assets/images/icon-armor.gif"
            alt="Armor icon"
            width="24"
            height="24"
          />
          <img
            v-if="isWeaponItemTypeSelected"
            class="form-calculation-result__key-image"
            src="../assets/images/icon-weapon.gif"
            alt="Weapon icon"
            width="24"
            height="24"
          />
          <span>
            x
            {{ itemsRequiredCount }}
          </span>
        </span>
        <span class="form-calculation-result__value">{{ formatNumberWithDots(itemCost) }}</span>
      </div>
      <div class="form-calculation-result">
        <span class="form-calculation-result__key">
          <img
            v-if="defaultUpgradeMaterialImageUrl"
            :src="defaultUpgradeMaterialImageUrl"
            :alt="defaultUpgradeMaterialName + ' icon'"
            width="24"
            height="24"
            class="upgrade-material-image"
          />
          <span>
            x
            {{ defaultUpgradeMaterialRequiredCount }}
          </span>
        </span>
        <span class="form-calculation-result__value">{{
          formatNumberWithDots(defaultUpgradeMaterialCost)
        }}</span>
      </div>
      <div class="form-calculation-result" v-if="enrichedMaterialUsed">
        <span class="form-calculation-result__key">
          <img
            v-if="enrichedMaterialImageUrl"
            :src="enrichedMaterialImageUrl"
            :alt="enrichedMaterialName + ' icon'"
            width="24"
            height="24"
            class="upgrade-material-image"
          />
          <span>
            x
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
        <span class="form-calculation-result__key">Комиссия NPC</span>
        <span class="form-calculation-result__value">
          {{ formatNumberWithDots(npcComission) }}
        </span>
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
import type Settings from '@/interfaces/local-storage/Settings';

type UpgradeItemType = 'armor' | 'weapon';
type UpgradeMethod = 'npc' | 'whiteSmith';

const showUpgradeMethodImages = ref(false);
const selectedUpgradeItemType = ref<UpgradeItemType>('armor');
const itemPrice = ref(900000);
const defaultMaterialPrice = ref(0);
const weaponLevel = ref(1);
const enrichedMaterialPrice = ref(2500000);
const upgradeUntil = ref(0);
const enrichedMaterialUsedFrom = ref(-1);
const upgradeMethod = ref<UpgradeMethod>('npc');

const isArmorItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'armor');
const isWeaponItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'weapon');
const isNpcUpgradeMethodSelected = computed(() => upgradeMethod.value === 'npc');
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

const enrichedMaterialImageUrl = computed(() => {
  if (!enrichedMaterial.value) {
    return '';
  }
  return new URL(`../assets/images/${enrichedMaterial.value.imageName}`, import.meta.url).href;
});

const upgradeData = computed<WeaponUpgradeLevelData | ArmorUpgradeData>(() => {
  if (isArmorItemTypeSelected.value) {
    return armorUpgradeData;
  }
  const levelKey = ('lvl' + weaponLevel.value) as keyof WeaponUpgradeData;
  return weaponUpgradeData[levelKey];
});

const defaultUpgradeMaterial = computed<UpgradeMaterial | null>(() => {
  return upgradeMaterials.find((m) => m.id === upgradeData.value.materialId) ?? null;
});

const defaultUpgradeMaterialName = computed(() => {
  return defaultUpgradeMaterial.value?.name ?? '';
});

const defaultUpgradeMaterialImageUrl = computed(() => {
  if (!defaultUpgradeMaterial.value) {
    return '';
  }
  return new URL(`../assets/images/${defaultUpgradeMaterial.value.imageName}`, import.meta.url)
    .href;
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

const isEnrichedMaterialUsagePossible = computed(() => {
  return possibleEnrichedMaterialUpgradeLevels.value.length > 0;
});

const requiredUpgradeMaterials = computed<RequiredUpgradeMaterials>(() => {
  return calculateCombinedUpgradeMaterials(
    defaultMaterialUpgradeProbabilities.value,
    enrichedMaterialUpgradeProbabilities.value
  );
});

const defaultUpgradeMaterialRequiredCount = computed(() => {
  return requiredUpgradeMaterials.value.defaultMaterialCount;
});

const enrichedMaterialRequiredCount = computed(() => {
  return requiredUpgradeMaterials.value.enrichedMaterialCount;
});

const itemCost = computed(() => {
  return roundToDecimalPlace(itemsRequiredCount.value * itemPrice.value, 0);
});

const defaultUpgradeMaterialCost = computed(() => {
  return roundToDecimalPlace(
    defaultUpgradeMaterialRequiredCount.value * defaultMaterialPrice.value,
    0
  );
});

const enrichedMaterialCost = computed(() => {
  return roundToDecimalPlace(enrichedMaterialRequiredCount.value * enrichedMaterialPrice.value, 0);
});

const npcComission = computed(() => {
  if (isWeaponItemTypeSelected.value && isWhiteSmithUpgradeMethodSelected.value) {
    return 0;
  }
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
  if (!defaultUpgradeMaterial.value) {
    return;
  }
  const materialPrice: MaterialPrice = {
    id: defaultUpgradeMaterial.value?.id,
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

watch(upgradeUntil, (newVal) => {
  if (!enrichedMaterialUsed.value) {
    return;
  }
  if (newVal < enrichedMaterialUsedFrom.value) {
    enrichedMaterialUsedFrom.value = -1;
  }
});

watch(
  defaultUpgradeMaterial,
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
.upgrade-material-image {
  margin-bottom: -0.3rem;
  margin-right: 0.3rem;
}
.upgrade-material-name {
  font-weight: 600;
  display: inline;
}
</style>
