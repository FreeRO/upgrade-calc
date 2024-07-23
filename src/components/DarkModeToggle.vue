<template>
  <button
    type="button"
    class="dark-mode-toggle inline-flex text-zinc-300 outline-blue-500 hover:text-zinc-400 dark:text-zinc-500 dark:hover:text-zinc-400"
    @click="toggleDarkMode"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden="true"
      data-slot="icon"
      class="dark-mode-toggle__icon"
      v-show="!darkModeEnabled"
    >
      <path
        fill-rule="evenodd"
        d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <svg
      id="theme-toggle-light-icon"
      class="dark-mode-toggle__icon"
      aria-hidden="true"
      data-slot="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
      v-show="darkModeEnabled"
    >
      <path
        d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"
      ></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import type CalculatorSettings from '@/interfaces/local-storage/CalculatorSettings';
import { onMounted, ref } from 'vue';

const darkModeEnabled = ref(false);

function toggleDarkMode() {
  darkModeEnabled.value = !darkModeEnabled.value;
  if (darkModeEnabled.value) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  saveDarkModeInfoToLocalStorage(darkModeEnabled.value);
}

function getSettingsFromLocalStorage() {
  const settingsString = localStorage.getItem('settings');
  const settings = settingsString ? (JSON.parse(settingsString) as CalculatorSettings) : null;
  return settings;
}

function saveDarkModeInfoToLocalStorage(darkModeEnabled: boolean) {
  let settings = getSettingsFromLocalStorage();
  if (settings !== null) {
    settings.darkModeEnabled = darkModeEnabled;
  } else {
    settings = {
      darkModeEnabled
    };
  }
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Invalid JSON for settings', error);
  }
}

onMounted(() => {
  const settings = getSettingsFromLocalStorage();
  if (settings) {
    darkModeEnabled.value = settings.darkModeEnabled;
  }
  if (darkModeEnabled.value) {
    document.body.classList.add('dark');
  }
});
</script>

<style lang="scss">
.dark-mode-toggle {
  display: inline-flex;
  background-color: transparent;
  padding: 0.625rem 0.75rem;

  &:hover {
    background-color: var(--color-dark-mode-toggle-hover);
  }

  &__icon {
    height: 1.25rem;
    width: 1.25rem;
    fill: var(--color-dark-mode-toggle-icon);
  }
}
</style>
