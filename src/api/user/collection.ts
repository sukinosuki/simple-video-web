/**
 * Author: hanami
 * Date: 2023-03-15 14:14:47
 * Description: collection.ts
 */

import http from '../http'

export namespace API_Collection {
  export interface Add {
    vid: number
  }
  export interface GetAll {
    page: number
    size: number
  }
}

export default {
  add: (data: API_Collection.Add) => http.post('/api/v1/user/collection/video', data),

  delete: (vid: number) => http.delete(`/api/v1/user/collection/video/${vid}`),

  getAll: (params: API_Collection.GetAll) => http.get('/api/v1/user/collection/video', params),
}
