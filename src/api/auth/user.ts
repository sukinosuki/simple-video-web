/**
 * Author: hanami
 * Date: 2023-03-17 11:30:50
 * Description: user.ts
 */

import http from '../http'
import type { Auth } from '~/type/auth'

export default {

  getProfile: (uid: number) => http.get<Auth.Profile>(`/api/v1/user/${uid}/profile`),
}
