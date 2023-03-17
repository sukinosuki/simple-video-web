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
import comment from './comment'
import upload from './upload'

export default {
  auth,
  email,
  video,
  like,
  collection,
  userVideo,
  comment,
  upload,
}
