<script setup lang="ts">
const props = defineProps<{
  title: string
  back?: boolean
  fixed?: boolean
  onBack?: () => void
}>()
</script>

<template>
  <VarAppBar class="app-bar" :class="{ fixed: props.fixed }" :title="props.title">
    <template v-if="props.back" #left>
      <var-button
        color="transparent"
        text-color="#fff"
        round
        text
        @click="props.onBack"
      >
        <var-icon name="chevron-left" size="2.4rem" />
      </var-button>
    </template>
  </VarAppBar>
</template>

<style lang="scss" scoped>
.app-bar {
  &.fixed {
    top: 0;
    position: fixed;
    z-index: 99;
  }
}
</style>
