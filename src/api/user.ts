/**
 * Author: hanami
 * Date: 2023-03-23 13:52:48
 * Description: user.ts
 */

import http from './http'
import type { User } from '~/type'

export namespace API_User {
  export interface GetAll {
    page?: number
    size?: number
    search_key?: string
  }
}

export default {
  getAll: (params: API_User.GetAll) => http.get<User.Simple[]>('/api/v1/user', params),

}
