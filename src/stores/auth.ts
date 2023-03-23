/**
 * Author: hanami
 * Date: 2023-03-15 10:00:08
 * Description: auth.ts
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Auth } from '~/type/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')

  const isLogin = computed(() => !!token?.value.length)

  const userProfile = ref<Auth.Profile>({} as any)

  // 登录
  function login(data: Auth.LoginRes) {
    token.value = data.token

    // TODO:
    localStorage.setItem('token', data.token)

    userProfile.value = data.profile
  }

  function setProfile(profile: Auth.Profile) {
    userProfile.value = profile
  }

  // 登出
  function logout() {
    console.log('authStore [logout]')

    // TODO
    localStorage.removeItem('token')
    token.value = ''
  }

  function setToken(_token: string) {
    token.value = _token
  }

  return {
    login,
    logout,
    setToken,
    setProfile,
    token,
    isLogin,
    userProfile,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
