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
  timeout: 30000,
})

instance.interceptors.request.use((config) => {
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
  console.log('res ', res)
  // await sleep()

  const { status, data } = res

  if (status !== 200)
    return Promise.reject(status)

  const { code, msg } = data

  if (code === 0)
    return data

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

  delete<T = null>(url: string, data = {}): Promise<AppResponse<T>> {
    return instance.delete(url, { data })
  },
}
