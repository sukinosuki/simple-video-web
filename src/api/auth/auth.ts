/**
 * Author: hanami
 * Date: 2023-03-14 16:49:58
 * Description: login.ts
 */

import http from '../http'
import type { Auth } from '~/type/auth'
import type { Gender } from '~/type/enum'

export namespace API_Auth {
  export interface Login {
    email: string
    password: string
  }

  export interface Register {
    email: string
    password: string
    code: string
  }

  export interface UpdateProfile {
    nickname: string
    avatar: string
    gender: Gender
    birthday?: string | null
  }
}

export default {

  getProfile: () => http.get<Auth.Profile>('/api/v1/auth/profile'),

  updateProfile: (data: API_Auth.UpdateProfile) => http.put<Auth.Profile>('/api/v1/auth/profile', data),

  login: (data: API_Auth.Login) => http.post<Auth.LoginRes>('/api/v1/auth/login', data),

  register: (data: API_Auth.Register) => http.post<Auth.LoginRes>('/api/v1/auth/register', data),
}
