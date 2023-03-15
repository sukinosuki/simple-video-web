<route lang="yaml">
meta:
  layout: home2
</route>

<script setup lang="ts">
import { ref } from 'vue'
import api from '~/api'
import type { API_Like } from '~/api/user/like'
import { LikeType } from '~/types/enum'
import type { Video } from '~/types/video'
import { toCatch } from '~/utils'
import { toast } from '~/utils/toast'

const video = ref<Video.Res>()
defineOptions({
  name: 'HomePage',
})

const videoRef = ref<HTMLVideoElement>()
const isPaused = ref(true)
const actionLoading = ref(false)

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

  console.log('res ', res)

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
  // if (video.value!.is_like) {
  // }
  // else {

  // }
}
// 收藏
const handleCollect = async () => {
  if (!authStore.isLogin) {
    await toast('请先登录')
    router.push({
      path: '/login',
      query: {
        from: 'index',
      },
    })
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
const handleSideAction = (actionType: SideActionType) => {
  switch (actionType) {
    case SideActionType.COLLECT:
      handleCollect()
      break
    case SideActionType.LIKE:
      handleLike()
      break
    case SideActionType.COMMENT:
      break
    default:
      console.log('default')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
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
          <VarIcon size="26" :name="video?.is_like ? 'heart' : 'heart-outline'" />
          <span class="text">{{ video?.like_count || 0 }}</span>
        </div>
      </VarButton>

      <VarButton text class="action-item">
        <div class="content">
          <VarIcon size="26" name="message-processing-outline" />
          <span class="text">{{ video?.comment_count || 0 }}</span>
        </div>
      </VarButton>

      <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.COLLECT)">
        <div class="content">
          <VarIcon size="26" :name="video?.is_collect ? 'star' : 'star-outline'" />
          <span class="text">{{ video?.collection_count || 0 }}</span>
        </div>
      </VarButton>
    </div>

    <div class="video-content" @click="handleVideoContentClick">
      <video ref="videoRef" loop class="video" src="https://img1.puxiansheng.com/uploads/video/20230307/5ab26b03303883116e42ab7b18fcda868c647947.mp4" />

      <div v-if="isPaused" class="pause-icon">
        <VarIcon size="150" name="menu-right" />
      </div>
    </div>
  </div>
</template>

  <style scoped lang="scss">
  .home {
    height: 100%;
    position: relative;
    background-color: black;
  }
  .video-author-info {
    color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-bottom: 2rem;
    padding-left: 2rem;

    z-index: 99;

    .username {

      font-weight: 500;
      font-size: 1.6rem;
    }
    .video-title {
      margin-top: 1rem;
      font-size: 1.6rem;
    }
  }
  .right-side {
    display: inline-flex;
    color: white;
    padding-right: 1rem;
    flex-direction: column;
    position: absolute;
    right: 0;
    bottom: 15rem;
    z-index: 99;

    .action-item {
      padding: 0.2rem 1rem;
      height: 4.4rem;

      .content {

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        .text {
          line-height: 1;
          font-size: 1.2rem;
        }
      }
    }
  }

  .video-content {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .pause-icon {
      position: absolute;
      z-index: 99;
      color: rgb(246, 246, 246);
    }
  }
</style>
