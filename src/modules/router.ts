/**
 * Author: hanami
 * Date: 2023-03-16 18:05:06
 * Description: router.ts
 */

import { type UserModule } from '~/types'

// https://github.com/antfu/vitesse/issues/244#issuecomment-1329750782
export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    const authStore = useAuthStore()
    console.log('authStore.isLogin ', authStore.isLogin)

    router.beforeEach((to, from, next) => {
      const isLogin = authStore.isLogin
      const requireAuth = to.meta.requireAuth

      if (requireAuth && !isLogin) {
        router.push('/login')
        return
      }

      // your auth logic
      next()
    })
  }
}
