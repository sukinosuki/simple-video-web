/**
 * Author: hanami
 * Date: 2023-03-23 13:56:20
 * Description: user.ts
 */

export namespace User {
  export interface Simple {
    avatar: string// ''
    followers: number// 0
    following_count: number// 0
    id: number// 1
    is_follow: boolean// false
    nickname: string // 'miiro@qq.c'
    video_count: number// 1

    _loading?: boolean
  }
}
