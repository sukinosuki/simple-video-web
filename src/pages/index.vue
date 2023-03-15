<route lang="yaml">
meta:
  layout: home2
    </route>

<script setup lang="ts">
const active = ref(0)
const navMap = {
  0: '/',
  1: '/friend',
  2: '/message',
  3: '/me',
}
const router = useRouter()
const handleChange = (_active: number | string) => {
  console.log('active ', _active)

  const path = navMap[_active]

  console.log('path ', path)

  router.replace(path)
}
</script>

<template>
  <div class="page main-page">
    <main class="main">
      <router-view />
    </main>

    <var-bottom-navigation v-model:active="active" class="bottom-navigation" @change="handleChange">
      <var-bottom-navigation-item label="首页" icon="home" />
      <var-bottom-navigation-item label="朋友" icon="magnify" />
      <var-bottom-navigation-item label="消息" icon="heart" />
      <var-bottom-navigation-item label="我" icon="account-circle" />
    </var-bottom-navigation>
  </div>
</template>

<style scoped lang="scss">
.main-page  {
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
