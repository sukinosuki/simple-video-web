/**
 * Author: hanami
 * Date: 2023-03-14 16:54:27
 * Description: index.ts
 */

import auth from './user/auth'
import email from './email'
import video from './video'
import collection from './user/collection'
import like from './user/like'
import userVideo from './user/video'

export default {
  auth,
  email,
  video,
  like,
  collection,
  userVideo,
}
