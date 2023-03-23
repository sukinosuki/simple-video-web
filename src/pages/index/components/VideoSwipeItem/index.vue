<script lang="ts" setup>
import api from '~/api'
import type { API_Like } from '~/api/auth/like'
import { LikeType, PageStatus } from '~/type/enum'
import type { Video } from '~/type/video'
import { sleep, toCatch } from '~/utils'
import { toast } from '~/utils/toast'

const props = defineProps<{
  video: Video.Simple
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'comment', video: Video.Res): void
}>()

enum SideActionType {
  LIKE = 1,
  COMMENT = 2,
  COLLECT = 3,
}

const authStore = useAuthStore()
const router = useRouter()
const videoRef = ref<HTMLVideoElement>()

const isPaused = ref(true)
const actionLoading = ref(false)
const isInit = ref(false)
const videoRes = ref<Video.Res | null>(null)
const pageStatus = ref(PageStatus.LOADING)

//
const fetchVideo = async () => {
  await sleep(1000)
  const [err, res] = await toCatch(api.video.get(props.video.id))
  if (err) {
    pageStatus.value = PageStatus.FAILED
    return
  }

  pageStatus.value = PageStatus.LOADED
  videoRes.value = res
}

watchEffect(() => {
  if (props.active && !isInit.value)
    fetchVideo()
})

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

//
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

  const fn = videoRes.value!.is_like! ? api.like.dislike : api.like.like
  const data: API_Like.Like = {
    vid: videoRes.value!.video.id,
    like_type: LikeType.LIKE,
  }
  const [err] = await toCatch(fn(data))

  actionLoading.value = false
  if (err)
    return

  videoRes.value!.like_count = videoRes.value!.like_count + (videoRes.value!.is_like ? -1 : 1)
  videoRes.value!.is_like = !videoRes.value!.is_like
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
  if (videoRes.value!.is_collect) {
    const [err] = await toCatch(api.collection.delete(props.video.id))
    actionLoading.value = false
    if (err)
      return

    videoRes.value!.is_collect = false
    videoRes.value!.collection_count -= 1
  }
  else {
    //
    const [err] = await toCatch(api.collection.add({ vid: props.video.id }))
    actionLoading.value = false
    if (err)
      return
    videoRes.value!.is_collect = true
    videoRes.value!.collection_count += 1
  }
}

//
const handleSideAction = (actionType: SideActionType) => {
  if (pageStatus.value !== PageStatus.LOADED) {
    toast('还没有准备好')
    return
  }

  switch (actionType) {
    case SideActionType.COLLECT:
      handleCollect()
      break
    case SideActionType.LIKE:
      handleLike()
      break
    case SideActionType.COMMENT:
      emit('comment', videoRes.value!)
      break
    default:
      console.log('default')
  }
}
</script>

<template>
  <div class="video-wrap">
    <div class="video-author-info">
      <h3 class="username">
        @{{ video.user.nickname }}
      </h3>
      <h4 class="video-title">
        {{ video.title }}
      </h4>
    </div>

    <div class="right-side">
      <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.LIKE)">
        <div class="content">
          <VarIcon size="26" :color="videoRes?.is_like ? 'var(--primary-color)' : ''" :name="videoRes?.is_like ? 'heart' : 'heart-outline'" />
          <span class="text">{{ videoRes?.like_count || 0 }}</span>
        </div>
      </VarButton>

      <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.COMMENT)">
        <div class="content">
          <VarIcon size="26" name="message-processing-outline" />
          <span class="text">{{ videoRes?.comment_count || 0 }}</span>
        </div>
      </VarButton>

      <VarButton text class="action-item" @click="() => handleSideAction(SideActionType.COLLECT)">
        <div class="content">
          <VarIcon size="26" :color="videoRes?.is_collect ? 'orange' : ''" :name="videoRes?.is_collect ? 'star' : 'star-outline'" />
          <span class="text">{{ videoRes?.collection_count || 0 }}</span>
        </div>
      </VarButton>
    </div>

    <div class="video-content" @click="handleVideoContentClick">
      <video ref="videoRef" autoplay class="video" :src="videoRes?.video.url" />

      <div v-if="pageStatus === PageStatus.LOADED && isPaused" class="pause-icon">
        <VarIcon size="150" name="menu-right" />
      </div>

      <div v-if="!pageStatus || pageStatus === PageStatus.LOADING" class="loading">
        <VarLoading type="cube" color="white" size="large" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
