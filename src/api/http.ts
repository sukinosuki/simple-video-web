/**
 * Author: hanami
 * Date: 2023-03-14 16:44:28
 * Description: http.ts
 */

import axios from 'axios'
import { toast } from '~/utils/toast'
// import appConfig from '@/config'

const instance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '' : appConfig.SERVER_URL,
  // baseURL: import.meta.env.VITE_SERVER_URL, // 需要通过npm run dev | npm run build:test | npm run build:prod 来区分请求地址
  // baseURL: 'http://127.0.0.1:2333/app', // 需要通过npm run dev | npm run build:test | npm run build:prod 来区分请求地址
  timeout: 300000,
})

enum AppResponseCode {
  EXPIRED = 10020,
}

// const authStore = useAuthStore()

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  const token = localStorage.getItem('token')

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token,
    },
  } as any
})

instance.interceptors.response.use(async (res) => {
  const authStore = useAuthStore()

  // await sleep()

  const { status, data } = res

  if (status !== 200)
    return Promise.reject(status)

  const { code, msg } = data

  if (code === 0)
    return data

  switch (code) {
    case AppResponseCode.EXPIRED:
      authStore.logout()
      break
    default:
      console.log('')
  }

  toast(msg)
  return Promise.reject(data)
}, (err) => {
  // TODO
  console.log('请求出错 err ', err)
  if (err.response.data) {
    toast(err.response.data.msg)
    return Promise.reject(err.response.data)
  }
})

export default {
  get<T = null>(url: string, params = {}): Promise<AppResponse<T>> {
    return instance.get(url, { params })
  },

  post<T = null>(url: string, data = {}): Promise<AppResponse<T>> {
    return instance.post(url, data)
  },

  put<T = null>(url: string, data = {}): Promise<AppResponse<T>> {
    return instance.put(url, data)
  },

  upload<T = null>(url: string, data = {}): Promise<AppResponse<T>> {
    return instance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete<T = null>(url: string, data = {}): Promise<AppResponse<T>> {
    return instance.delete(url, { data })
  },
}
