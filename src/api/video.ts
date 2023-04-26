/**
 * Author: hanami
 * Date: 2023-03-15 11:07:23
 * Description: video.ts
 */

import http from './http'
import type { Video } from '~/type/video'

export namespace API_Video {
  export interface GetAll {
    page: number
    size: number
    uid?: number
    exclude?: number[]
  }
  export interface Add {
    cover: string
    url: string
    title: string
  }
  export interface Update {
    cover: string
    title: string
  }
}

export default {
  // getAll: (params: API_Video.GetAll) => http.get<Video.Simple[]>('/api/v1/video', params),
  feed: (params: API_Video.GetAll) => http.get<Video.Simple[]>('/api/v1/feed', params),

  getAll: (uid: number, params: API_Video.GetAll) => http.get<Video.Simple[]>(`/api/v1/user/${uid}/video`, params),

  get: (id: number) => http.get<Video.Res>(`/api/v1/video/${id}`),

  //
  authAll: (params: API_Video.GetAll) => http.get<Video.Simple[]>('/api/v1/auth/video', params),

  add: (data: API_Video.Add) => http.post('/api/v1/auth/video', data),

  delete: (id: number) => http.delete(`/api/v1/auth/video/${id}`),

  update: (data: API_Video.Update) => http.put('/api/v1/auth/video', data),
}
