<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,

// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Simple Video App',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

const authStore = useAuthStore()

// const appInit = async () => {
const token = localStorage.getItem('token')
console.log('[appInit] token ', token)

if (token) {
  // const[err,res]=await toCatch()
  authStore.setToken(token)
}
// }

// onMounted(() => {
//   appInit()
// })
</script>

<template>
  <RouterView />
</template>
