<template>
  <div class="upgrade-calculator">
    <div class="upgrade-calculator__header">
      <div class="upgrade-calculator__title">Калькулятор стоимости заточки</div>
      <DarkModeToggle />
    </div>
    <UpgradeForm />
    <div class="upgrade-calculator__credits">
      Сделал <a href="https://forum.free-ro.com/members/10708/" target="_blank">andrew_z</a> для
      <a href="https://free-ro.ru" target="_blank">FreeRo</a> &lt;3
    </div>
  </div>
</template>

<script setup lang="ts">
import UpgradeForm from '@/components/UpgradeForm.vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
</script>

<style scoped lang="scss">
.upgrade-calculator {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 510px;
  margin: 0 auto;
  border-radius: var(--c-border-radius-medium);
  min-height: 100%;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 1.5rem;
    justify-content: space-between;
  }
  &__title {
    font-size: 1.4rem;
    font-weight: 700;
    text-align: left;
    margin-right: 2rem;
  }
  &__credits {
    padding-top: 4rem;
    font-size: 0.7rem;
    width: 100%;
    text-align: center;
    margin-top: auto;
  }
}

@media (min-width: 600px) {
  .upgrade-calculator {
    &__header {
      margin-bottom: 1.8rem;
    }
    &__title {
      font-size: 1.5rem;
    }
  }
}

@media (min-width: 1100px) {
  .upgrade-calculator {
    max-width: 1250px;
    padding: 0 1.5rem;
    &__header {
      margin-bottom: 2.4rem;
      align-items: center;
    }
    &__title {
      font-size: 1.8rem;
    }
  }
}

@media (min-width: 1600px) {
  .upgrade-calculator {
    max-width: 1300px;
  }
}

@media (min-width: 2000px) {
  .upgrade-calculator {
    max-width: 1350px;
  }
}
</style>
