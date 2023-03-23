/**
 * Author: hanami
 * Date: 2023-03-15 15:29:49
 * Description: video.ts
 */

import http from '../http'

export namespace API_UserVideo {
  export interface GetAll {
    page: number
    size: number
  }
}

export default {
  getAll: (uid: number, params: API_UserVideo.GetAll) => http.get(`/api/v1/user/${uid}/video`, params),
}
