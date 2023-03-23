/**
 * Author: hanami
 * Date: 2023-03-15 09:22:55
 * Description: email.ts
 */

import http from './http'
import type { EmailActionType } from '~/type/enum'

export namespace API_Email {
  export interface Send {
    email: string
    action_type: EmailActionType
  }
}

export default {
  send: (data: API_Email.Send) => http.post<string>('/api/v1/send-email', data),
}
