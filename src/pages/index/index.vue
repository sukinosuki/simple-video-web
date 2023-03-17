<route lang="yaml">
meta:
  layout: home2
</route>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import api from '~/api'
import type { API_Comment } from '~/api/comment'
import type { API_Like } from '~/api/user/like'
import { LikeType, MediaType } from '~/types/enum'
import type { Video } from '~/types/video'
import type { Comment } from '~/types/comment'
import { toCatch } from '~/utils'
import { toast } from '~/utils/toast'

const video = ref<Video.Res>()
defineOptions({
  name: 'HomePage',
})

const videoRef = ref<HTMLVideoElement>()
const isPaused = ref(true)
const actionLoading = ref(false)
const comments = ref<Comment.Simple[]>([])
const commentLoading = ref(false)
const commentDialogVisible = ref(false)
const commentContent = ref('')

enum SideActionType {
  LIKE = 1,
  COMMENT = 2,
  COLLECT = 3,
}

const authStore = useAuthStore()
const router = useRouter()

//
const fetchData = async () => {
  const [err, res] = await toCatch(api.video.get(4))
  if (err)
    return

  video.value = res
}

//
const handleVideoContentClick = () => {
  console.log('videoRef ', videoRef.value)
  const v = videoRef.value!
  console.log('v.paused ', v.paused)
  if (v.paused)
    v.play()

  else
    v.pause?.()

  isPaused.value = v.paused
}

const handleLike = async () => {
  if (!authStore.isLogin) {
    await toast('请先登录')
    router.push({
      path: '/login',
      query: {
        from: 'index',
      },
    })

    return
  }

  if (actionLoading.value)
    return

  actionLoading.value = true

  const fn = video.value!.is_like ? api.like.dislike : api.like.like
  const data: API_Like.Like = {
    vid: video.value!.video.id,
    like_type: LikeType.LIKE,
  }
  const [err] = await toCatch(fn(data))

  actionLoading.value = false
  if (err)
    return

  video.value!.like_count = video.value!.like_count + (video.value!.is_like ? -1 : 1)
  video.value!.is_like = !video.value!.is_like
}

// 收藏
const handleCollect = async () => {
  if (!authStore.isLogin) {
    await toast('请先登录')
    console.log('push')

    router.push({
      path: '/login',
      query: {
        from: 'index',
      },
    })

    return
  }

  if (actionLoading.value)
    return

  actionLoading.value = true
  if (video.value!.is_collect) {
    const [err] = await toCatch(api.collection.delete(video.value!.video.id))
    actionLoading.value = false
    if (err)
      return

    video.value!.is_collect = false
    video.value!.collection_count -= 1
  }
  else {
    //
    const [err] = await toCatch(api.collection.add({ vid: video.value!.video.id }))
    actionLoading.value = false
    if (err)
      return
    video.value!.is_collect = true
    video.value!.collection_count += 1
  }
}

//
const handleComment = async () => {
  console.log('[handleComment]')

  commentDialogVisible.value = true
  // if (commentLoading.value || comments.value.length)
  //   return

  commentLoading.value = true
  const params: API_Comment.GetAll = {
    page: 1,
    size: 10,
    media_id: video.value!.video.id,
    media_type: 1, // TODO
  }

  const [err, res] = await toCatch(api.comment.getAll(params))
  commentLoading.value = false
  if (err)
    return

  console.log('res ', res)
  comments.value = res
}

//
const handleSendComment = async () => {
  // TODO 校验
  console.log('content ', commentContent.value)
  // TODO: 一级、二级评论
  const data: API_Comment.Add = {
    media_id: video.value!.video.id,
    media_type: MediaType.VIDEO,
    content: commentContent.value,
  }
  const [err, res] = await toCatch(api.comment.add(data))
  if (err)
    return

  comments.value.unshift(res)
}

//
const handleSideAction = (actionType: SideActionType) => {
  switch (actionType) {
    case SideActionType.COLLECT:
      handleCollect()
      break
    case SideActionType.LIKE:
      handleLike()
      break
    case SideActionType.COMMENT:
      handleComment()
      break
    default:
      console.log('default')
  }
}

watchEffect(() => {
  if (video.value)
    handleComment()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <KeepAlive>
    <div class="home ">
      <div class="video-author-info">
        <h3 class="username">
          @{{ video?.video.user.nickname }}
        </h3>
        <h4 class="video-title">
          {{ video?.video.title }}
        </h4>
      </div>

      <div class="right-side">
        <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.LIKE)">
          <div class="content">
            <VarIcon size="26" :color="video?.is_like ? 'var(--primary-color)' : ''" :name="video?.is_like ? 'heart' : 'heart-outline'" />
            <span class="text">{{ video?.like_count || 0 }}</span>
          </div>
        </VarButton>

        <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.COMMENT)">
          <div class="content">
            <VarIcon size="26" name="message-processing-outline" />
            <span class="text">{{ video?.comment_count || 0 }}</span>
          </div>
        </VarButton>

        <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.COLLECT)">
          <div class="content">
            <VarIcon size="26" :color="video?.is_collect ? 'orange' : ''" :name="video?.is_collect ? 'star' : 'star-outline'" />
            <span class="text">{{ video?.collection_count || 0 }}</span>
          </div>
        </VarButton>
      </div>

      <div class="video-content" @click="handleVideoContentClick">
        <video ref="videoRef" autoplay loop class="video" src="https://img1.puxiansheng.com/uploads/video/20230307/5ab26b03303883116e42ab7b18fcda868c647947.mp4" />

        <div v-if="isPaused" class="pause-icon">
          <VarIcon size="150" name="menu-right" />
        </div>
      </div>

      <var-popup v-model:show="commentDialogVisible" :default-style="false" position="bottom">
        <div class="comment-dialog-layout">
          <header class="header">
            <span>{{ video?.comment_count || 0 }} 条评论</span>
          </header>

          <div class="layout-content">
            <ul class="comment-list">
              <li v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="item-content">
                  <div class="item-left">
                    <div class="avatar">
                      <img :src="comment.user.avatar" class="img" alt="">
                    </div>
                  </div>

                  <div class="item-right">
                    <div class="item-right-content">
                      <div>
                        <span class="username">{{ comment.user.nickname }}</span>
                        <span class="up-tag">UP</span>
                      </div>
                      <div class="comment-content">
                        {{ comment.content }}
                      </div>

                      <div class="footer">
                        <div class="flex-1">
                          <span class="date">{{ dayjs(comment.created_at).format('MM-DD') }}</span>

                          <VarButton size="mini" class="reply-button" text>
                            回复
                          </VarButton>
                        </div>

                        <div>
                          <VarButton class="action-icon" size="mini" text>
                            <VarIcon name="heart-outline" size="16" />
                            <span class="num">233</span>
                          </VarButton>
                        </div>
                      </div>
                    </div>

                    <div v-if="comment.replies?.length" class="replies" @click.stop="() => {}">
                      <ul class="reply-list">
                        <li v-for="reply in comment.replies" :key="reply.id" v-ripple class="reply-item " @click.stop="() => {}">
                          <span class="username">{{ reply.user.nickname }}</span>
                          <span v-if="video?.video.user.id === reply.id" class="up-tag">UP</span>
                          <span class="colon">:</span>
                          <span class="comment-content">{{ reply.content }}{{ reply.content }}{{ reply.content }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div class="layout-content-footer">
              <div class="loading-wrap">
                <VarLoading type="circle" color="var(--primary-color)" />
              <!-- <span class="text">加载中</span> -->
              </div>

            <!-- <VarButton class="w100 primary">
              加载更多
            </VarButton> -->
            </div>
          </div>

          <footer class="layout-footer">
            <div class="content">
              <input v-model="commentContent" rows="3" placeholder="请输入文本" class="input" textarea>
            </div>

            <VarButton text class="send-icon" @click="handleSendComment">
              <VarIcon name="white-balance-sunny" />
            </VarButton>
          </footer>
        </div>
      </var-popup>
    </div>
  </KeepAlive>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
