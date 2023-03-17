/**
 * Author: hanami
 * Date: 2023-03-15 17:39:39
 * Description: comment.ts
 */

import http from './http'
import type { Comment } from '~/types/comment'
import type { MediaType } from '~/types/enum'

export namespace API_Comment {
  export interface GetAll {
    page: number
    size: number
    media_id: number
    media_type: 1
  }

  export interface Add {
    content: string
    media_id: number
    media_type: MediaType
    at_uid?: number
    root?: number
    reply_id?: number
  }
}

export default {
  getAll: (params: API_Comment.GetAll) => http.get<Comment.Simple[]>('/api/v1/comment', params),

  add: (data: API_Comment.Add) => http.post<Comment.Simple>('/api/v1/comment', data),
}
