/**
 * Author: hanami
 * Date: 2023-03-14 16:49:58
 * Description: login.ts
 */

import http from '../http'
import type User from '~/types/user'

export namespace API_Login {
  export interface Login {
    email: string
    password: string
  }

  export interface Register {
    email: string
    password: string
    code: string
  }
}

export default {

  getProfile: () => http.get('/api/v1/user/profile'),

  login: (data: API_Login.Login) => http.post<User.LoginRes>('/api/v1/user/login', data),

  register: (data: API_Login.Register) => http.post<User.LoginRes>('/api/v1/user/register', data),
}
