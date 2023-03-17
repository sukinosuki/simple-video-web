/**
 * Author: hanami
 * Date: 2023-03-16 16:33:58
 * Description: upload.ts
 */

import http from './http'

export namespace API_Upload {

}

export default {
  upload: (data: FormData) => http.upload<string>('/api/v1/upload', data),
}
