<template>
  <span class="upgrade-material-tag">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="materialName + ' icon'"
      width="24"
      height="24"
      class="upgrade-material-tag__image"
    />
    <span class="upgrade-material-tag__name">{{ materialName }}</span>
  </span>
</template>

<script setup lang="ts">
const { imageUrl, materialName } = defineProps<{
  imageUrl?: string;
  materialName?: string;
}>();
</script>

<style lang="scss">
.upgrade-material-tag {
  display: inline-flex;
  align-items: baseline;

  &__image {
    margin-top: -0.1rem;
    margin-right: 0.25rem;
    align-self: self-end;
  }
  &__name {
    font-weight: 600;
    display: inline;
  }
}
</style>
