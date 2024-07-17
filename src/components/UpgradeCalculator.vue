<template>
  <div class="upgrade-calculator">
    <div class="upgrade-calculator__title">Калькулятор стоимости заточки</div>
    <div class="upgrade-item-type-selector">
      <div
        class="upgrade-item-type-selector__option"
        :class="{ selected: isArmorItemTypeSelected }"
        @click="changeUpgradeItemType('armor')"
      >
        <div class="upgrade-item-type-selector__option-img-wrapper">
          <img
            class="upgrade-item-type-selector__option-img"
            src="../assets/images/icon-armor.gif"
            alt="Armor icon"
            width="24"
            height="24"
          />
        </div>
        <div class="upgrade-item-type-selector__option-text">Броня</div>
      </div>
      <div
        class="upgrade-item-type-selector__option"
        :class="{ selected: isWeaponItemTypeSelected }"
        @click="changeUpgradeItemType('weapon')"
      >
        <div class="upgrade-item-type-selector__option-img-wrapper">
          <img
            class="upgrade-item-type-selector__option-img"
            src="../assets/images/icon-weapon.gif"
            alt="Weapon icon"
            width="24"
            height="24"
          />
        </div>
        <div class="upgrade-item-type-selector__option-text">Оружие</div>
      </div>
    </div>
    <form class="form armor-upgrade-form" v-if="isArmorItemTypeSelected">
      <div class="form-input">
        <div class="form-input__label">Стоимость +0 предмета</div>
        <div class="form-input__input">
          <input type="number" v-model="armorPrice" />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {} from '@/utils/constants';

type UpgradeItemType = 'armor' | 'weapon' | 'none';

let selectedUpgradeItemType = ref<UpgradeItemType>('armor');
let weaponPrice = ref(0);
let armorPrice = ref(0);

const isArmorItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'armor');
const isWeaponItemTypeSelected = computed(() => selectedUpgradeItemType.value === 'weapon');

function changeUpgradeItemType(type: UpgradeItemType) {
  selectedUpgradeItemType.value = type;
}
</script>

<style scoped lang="scss">
.upgrade-calculator {
  width: 700px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  background-color: #ebebeb;
  border-radius: 7px;
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */

  &__title {
    font-size: 1.4rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
  }
}

.upgrade-item-type-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  &__option {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    margin: 0 1rem;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #f9f9f9;
    }
    &.selected {
      background-color: #f8f8f8;
    }
  }
  &__option-img-wrapper {
    width: 1.5rem;
    display: flex;
    flex-direction: row;
    margin-bottom: auto;
    margin-right: 0.5rem;
  }
  &__option-img {
    width: 100%;
    height: auto;
  }
}

.form {
  padding-top: 1rem;
}

.form-input {
  display: flex;
  flex-direction: row;
  align-items: center;

  &__label {
    margin-right: 0.5rem;
  }
}
</style>
