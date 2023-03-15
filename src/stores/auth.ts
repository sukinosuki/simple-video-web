/**
 * Author: hanami
 * Date: 2023-03-15 10:00:08
 * Description: auth.ts
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import type User from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')

  const isLogin = computed(() => !!token?.value.length)

  const userProfile = ref<User.Profile>({} as any)

  // 登录
  function login(data: User.LoginRes) {
    token.value = data.token

    // TODO:
    localStorage.setItem('token', data.token)

    userProfile.value = data.profile
  }

  // 登出
  function logout() {
    // TODO
    localStorage.removeItem('token')
  }

  function setToken(_token: string) {
    token.value = _token
  }

  return {
    login,
    logout,
    setToken,
    token,
    isLogin,
    userProfile,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
