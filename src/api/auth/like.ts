/**
 * Author: hanami
 * Date: 2023-03-15 14:36:02
 * Description: like.ts
 */

import http from '../http'
import type { LikeType } from '~/type/enum'

export namespace API_Like {
  export interface Like {

    vid: number
    like_type: LikeType
  }
}

export default {
  // 点赞、点踩
  like: (data: API_Like.Like) => http.post('/api/v1/user/like/video', data),

  // 取消点赞、取消点踩
  dislike: (data: API_Like.Like) => http.delete('/api/v1/user/like/video', data),
}
