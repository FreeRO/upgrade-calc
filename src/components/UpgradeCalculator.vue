<template>
  <div class="upgrade-calculator">
    <div class="upgrade-calculator__header">
      <div class="upgrade-calculator__title">Калькулятор стоимости заточки</div>
      <DarkModeToggle />
    </div>
    <UpgradeForm />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UpgradeForm from '@/components/UpgradeForm.vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
</script>

<style scoped lang="scss">
.upgrade-calculator {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
  border-radius: var(--c-border-radius-medium);
  &__header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 2.4rem;
    justify-content: space-between;
  }
  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: left;
    margin-right: 2rem;
  }
}

.upgrade-item-type-selector {
  width: 100%;
  display: flex;
  flex-direction: row;

  &__option {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    margin: 0 0.5rem;
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
</style>
