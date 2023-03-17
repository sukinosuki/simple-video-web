/**
 * Author: hanami
 * Date: 2023-03-15 17:57:37
 * Description: user.ts
 */

export namespace User {
  export interface LoginRes {
    profile: Profile
    token: string
  }

  export interface Profile {
    collection_count: number
    dislike_count: number
    fans_count: number
    like_count: number
    video_count: number
    user: User
  }

  export interface User {
    created_at: string
    email: string
    enabled: boolean
    id: number
    nickname: string
  }
}
