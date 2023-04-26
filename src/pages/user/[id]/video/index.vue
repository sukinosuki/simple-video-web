<route lang="yaml">
meta:
  layout: empty
        </route>

<script setup lang="ts">
import { Dialog } from '@varlet/ui'
import VideoItem from './components/VideoItem/index.vue'
import api from '~/api'
import type { API_Collection } from '~/api/auth/collection'
import { PageStatus } from '~/type/enum'
import type { Video } from '~/type/video'
import { toCatch } from '~/utils'
import { toast } from '~/utils/toast'
import EmptyImg from '~/assets/empty.jpg'

const route = useRoute()
const router = useRouter()

// let page = 0
const size = 7

interface LoadMoreStatus {
  isFinished: boolean
  loading: boolean
  data: Video.Simple[]
  refreshing: boolean
  page: number
  pageStatus: PageStatus
}

const loadMoreStatus = reactive<LoadMoreStatus>({
  isFinished: false,
  loading: false,
  data: [],
  refreshing: false,
  page: 0,
  pageStatus: PageStatus.LOADING,
})

//
const fetchData = async (isLoadMore = false) => {
  const params: API_Collection.GetAll = {
    size,
    page: isLoadMore ? loadMoreStatus.page + 1 : 1,
    // uid: , // TODO
  }

  const [err, res] = await toCatch(api.video.getAll(Number(route.params.id), params))
  loadMoreStatus.refreshing = false
  if (err) {
    loadMoreStatus.pageStatus = PageStatus.FAILED
    return
  }

  //
  loadMoreStatus.isFinished = res.length < size

  loadMoreStatus.loading = false

  //
  if (!isLoadMore && !res.length)
    loadMoreStatus.pageStatus = PageStatus.EMPTY
  else
    loadMoreStatus.pageStatus = PageStatus.LOADED

  if (isLoadMore) {
    loadMoreStatus.page += 1
    //
    loadMoreStatus.data.push(...res)
  }
  else {
    loadMoreStatus.page = 1
    loadMoreStatus.data = res
  }
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
  <div class="video-page">
    <AppBar fixed title="我的视频" back :on-back="router.back" />

    <VarPullRefresh
      v-model="loadMoreStatus.refreshing"
      class="main"
      :success-duration="1000"
      @refresh="fetchData"
    >
      <var-skeleton
        :rows="3"
        title
        :loading="loadMoreStatus.pageStatus === PageStatus.LOADING"
      >
        <div v-if="loadMoreStatus.pageStatus === PageStatus.EMPTY" class="page-empty">
          <img class="img" :src="EmptyImg">
          <span class="text">暂无数据</span>
        </div>

        <div v-if="loadMoreStatus.pageStatus === PageStatus.FAILED" class="page-error">
          <img class="img" :src="EmptyImg">
          <span class="text">加载失败</span>
        </div>

        <VarList
          v-if="loadMoreStatus.pageStatus === PageStatus.LOADED"
          v-model:loading="loadMoreStatus.loading"
          :finished="loadMoreStatus.isFinished"
          @load="() => fetchData(true)"
        >
          <VideoItem
            v-for="video in loadMoreStatus.data"
            :key="video.id"
            class="item"
            :video="video"
            @cancel-collect="handleCancelCollect"
          />
        </VarList>
      </var-skeleton>
    </VarPullRefresh>
  </div>
</template>

  <style lang="scss" scoped>
  @import './index.scss';
  </style>
