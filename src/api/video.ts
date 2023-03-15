/**
 * Author: hanami
 * Date: 2023-03-15 11:07:23
 * Description: video.ts
 */

import http from './http'
import type { Video } from '~/types/video'

export namespace API_Video {
  export interface GetAll {
    page: number
    size: number

  }
}
export default {
  getAll: (params: API_Video.GetAll) => http.get<Video.Simple[]>('/api/v1/video', params),

  get: (id: number) => http.get<Video.Res>(`/api/v1/video/${id}`),
}
