/**
 * Author: hanami
 * Date: 2023-03-15 11:04:14
 * Description: video.ts
 */

export namespace Video {
  export interface Res {
    video: {
      id: number
      created_at: string
      cover: string
      title: string
      url: string
      uid: number
      user: SimpleUser
    }
    like_count: number
    dislike_count: number
    is_like: boolean
    is_dislike: boolean
    is_collect: boolean
    collection_count: number
    comment_count: number
  }

  export interface Simple {
    id: number
    created_at: string
    cover: string
    url: string
    title: string
    locked: boolean
    user: SimpleUser
  }

  export interface SimpleUser {
    id: number
    nickname: string
    avatar: string
  }
}
