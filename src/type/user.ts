/**
 * Author: hanami
 * Date: 2023-03-23 13:56:20
 * Description: user.ts
 */

export namespace User {
  export interface Simple {
    user: {
      avatar: string// ''
      nickname: string // 'miiro@qq.c'
      id: number// 1
    }
    followers: number// 0
    following_count: number// 0
    is_following: boolean// false
    video_count: number// 1

    _loading?: boolean
  }
}
