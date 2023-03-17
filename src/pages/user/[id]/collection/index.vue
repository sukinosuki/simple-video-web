<route lang="yaml">
meta:
  layout: empty
      </route>

<script setup lang="ts">
import { Dialog } from '@varlet/ui'
import VideoItem from './components/VideoItem/index.vue'
import api from '~/api'
import type { API_Collection } from '~/api/user/collection'
import { PageStatus } from '~/types/enum'
import type { Video } from '~/types/video'
import { sleep, toCatch } from '~/utils'
import { toast } from '~/utils/toast'

const page = 1
const size = 10
const pageStatus = ref(PageStatus.LOADING)
const videos = ref<Video.Simple[]>([])

const isRefresh = ref(false)
const router = useRouter()

//
const fetchData = async () => {
  const params: API_Collection.GetAll = {
    page,
    size,
    uid: 5, // TODO
  }

  await sleep()

  const [err, res] = await toCatch(api.collection.getAll(params))
  isRefresh.value = false
  if (err) {
    pageStatus.value = PageStatus.FAILED
    return
  }

  videos.value = res
  if (page === 1 && !res.length)

    pageStatus.value = PageStatus.EMPTY

  else
    pageStatus.value = PageStatus.LOADED
}

// 取消收藏
const handleCancelCollect = async (video: Video.Simple) => {
  console.log('[handleCancelCollect] video ', video)
  Dialog({
    title: '提示',
    message: '删除该收藏吗?',
    onConfirm: () => {
      // TODO
      toast('删除成功')
    },
  })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="collection-page">
    <AppBar title="我的收藏" back :on-back="router.back" />

    <VarPullRefresh v-model="isRefresh" :success-duration="1000" class="main" @refresh="fetchData">
      <div class="main">
        <ul class="list">
          <VideoItem
            v-for="video in videos"
            :key="video.id" class="item" :video="video" @cancel-collect="handleCancelCollect"
          />
        </ul>
      </div>
    </VarPullRefresh>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
