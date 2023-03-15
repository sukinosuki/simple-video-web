<script setup lang="ts">
const active = ref(0)
</script>

<template>
  <div class="layout">
    <main class="main">
      <RouterView />
    </main>

    <var-bottom-navigation v-model:active="active" class="bottom-navigation">
      <var-bottom-navigation-item label="标签" icon="home" />
      <var-bottom-navigation-item label="标签" icon="magnify" />
      <var-bottom-navigation-item label="标签" icon="heart" />
      <var-bottom-navigation-item label="标签" icon="account-circle" />
    </var-bottom-navigation>
  </div>
</template>

<style scoped lang="scss">
.layout  {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
  }

  .bottom-navigation {
    flex-shrink: 0;
  }
}
</style>
