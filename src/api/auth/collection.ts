/**
 * Author: hanami
 * Date: 2023-03-15 14:14:47
 * Description: collection.ts
 */

import http from '../http'
import type { Video } from '~/type/video'

export namespace API_Collection {
  export interface Add {
    vid: number
  }
  export interface GetAll {
    page: number
    size: number
    // uid: number
  }
}

export default {
  // 添加收藏
  add: (data: API_Collection.Add) => http.post('/api/v1/auth/collection/video', data),

  // 删除收藏
  delete: (vid: number) => http.delete(`/api/v1/auth/collection/video/${vid}`),

  // 获取收藏列表
  getAll: (uid: number, params: API_Collection.GetAll) => http.get<Video.Simple[]>(`/api/v1/user/${uid}/collection/video`, params),
}
