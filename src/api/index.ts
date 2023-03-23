/**
 * Author: hanami
 * Date: 2023-03-14 16:54:27
 * Description: index.ts
 */

import auth from './auth/auth'
import email from './email'
import video from './video'
import collection from './auth/collection'
import like from './auth/like'
import userVideo from './auth/video'
import comment from './comment'
import upload from './upload'
// import user from './auth/user'
import follow from './follow'
import user from './user'

export default {
  auth,
  email,
  video,
  like,
  collection,
  userVideo,
  comment,
  upload,
  user,
  follow,
}
