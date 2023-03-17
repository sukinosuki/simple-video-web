<route lang="yaml">
meta:
  layout: empty
    </route>

<script setup lang="ts">
const active = ref('home')
const route = useRoute()

const navMap: Record<string, string> = {
  home: '/',
  friend: '/friend',
  message: '/message',
  me: '/me',
}

const navMap2: Record<string, string> = {
  '/': 'home',
  '/friend': 'friend',
  '/message': 'message',
  '/me': 'me',
}

const router = useRouter()

// TODO: 统一路由跳转
const toPublishPage = () => {
  router.push({
    name: 'publish',
  })
}

//
const handleNavChange = (_active: number | string) => {
  const path = navMap[_active as string]

  router.replace(path)
}

onMounted(() => {
  const name = navMap2[route.path]
  active.value = name
})
</script>

<template>
  <div class="page main-page">
    <main class="main">
      <router-view keep-alive />
    </main>

    <var-bottom-navigation v-model:active="active" :fab-props="{ type: 'primary' }" active-color="var(--primary-color)" class="bottom-navigation" @change="handleNavChange">
      <var-bottom-navigation-item name="home" label="首页" icon="home" />
      <var-bottom-navigation-item name="friend" label="朋友" icon="magnify" />
      <var-bottom-navigation-item name="message" label="消息" icon="bell" />
      <var-bottom-navigation-item name="me" label="我" icon="account-circle" />

      <template #fab>
        <VarIcon name="heart" @click="toPublishPage" />
      </template>
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
    overflow-y: scroll;
  }

  .bottom-navigation {
    flex-shrink: 0;
  }
}
</style>
