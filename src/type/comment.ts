/**
 * Author: hanami
 * Date: 2023-03-15 17:53:41
 * Description: comment.ts
 */

export namespace Comment {
  export interface Simple {
    at_uid: null | number
    content: string
    created_at: string
    dislike: number
    id: number
    like: number
    media_id: number
    media_type: number
    reply_count: number
    root: null | number
    row_num: number
    uid: number
    user: SimpleUser
    replies: Simple[]
  }

  export interface SimpleUser {
    avatar: string
    id: number
    nickname: string
  }
}
