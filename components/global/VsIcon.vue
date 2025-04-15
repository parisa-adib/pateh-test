<script setup>
const props = defineProps(["iconName", "type", "color", "size"]);
</script>

<template>
  <ClientOnly>
    <vsxicon
        :icon-name="props?.iconName"
        :color="props?.color"
        :size="props?.size"
        :type="props?.type"
    />
  </ClientOnly>
</template>
