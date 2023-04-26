/**
 * Author: hanami
 * Date: 2023-03-19 14:48:01
 * Description: follow.ts
 */

import http from './http'
import type { FollowRank } from '~/type'

export namespace API_Follow{
  export interface Rank {
    range: number[]
  }
}

export default {
  rank: (params: API_Follow.Rank) => http.get<FollowRank[]>('/api/v1/follow/rank', params),

  follow: (uid: number) => http.post(`/api/v1/auth/following/${uid}`),

  unFollow: (uid: number) => http.delete(`/api/v1/auth/following/${uid}`),
}
