<route lang="yaml">
meta:
  layout: home2
</route>

<script setup lang="ts">
import { ref } from 'vue'
import type { Swipe } from '@varlet/ui'
import VideoSwipeItem from './components/VideoSwipeItem/index.vue'
import CommentLayout from './components/CommentLayout/index.vue'
import api from '~/api'
import { PageStatus } from '~/type/enum'
import type { Video } from '~/type/video'
import { toCatch } from '~/utils'
import type { API_Video } from '~/api/video'

defineOptions({
  name: 'HomePage',
})

const videos = reactive<Video.Simple[]>([])

const commentDialogVisible = ref(false)
const pageStatus = ref<PageStatus | null>(null)
const index = ref(0)
const swipeRef = ref<Swipe>()
const currentVideo = ref<Video.Res | null>(null)

const activeVideoId = ref<number | null>(null)

//
const fetchData = async (down = true) => {
  if (pageStatus.value === PageStatus.LOADING)
    return

  pageStatus.value = PageStatus.LOADING

  const params: API_Video.GetAll = {
    page: 1,
    size: 10,
    exclude: videos.map(item => item.id),
  }

  const [err, res] = await toCatch(api.video.feed(params))
  if (err) {
    pageStatus.value = PageStatus.FAILED
    return
  }

  if (down) {
    console.log('往后加 ', index.value)

    videos.push(...res)
  }
  else { videos.unshift(...res) }

  if (!down && res.length)
    activeVideoId.value = res[0].id

  pageStatus.value = PageStatus.LOADED
}

// 查看评论
const handleViewComment = async (_video: Video.Res) => {
  console.log('[handleComment]')

  currentVideo.value = _video
  commentDialogVisible.value = true
}

//
const handleSwipeChange = async (_index: number) => {
  console.log('video length ', videos.length)
  console.log('index', _index)

  index.value = _index
  const video = videos[_index]!

  activeVideoId.value = video.id

  // 向下
  if (_index >= videos.length - 2) {
    console.log('到达 最后 ')

    fetchData()
  }

  // if (index <= 2){

  //   fetchData(false)
  // }
}
//

onMounted(() => {
  fetchData(false)
})
</script>

<template>
  <div class="home">
    <var-swipe
      ref="swipeRef"
      class="swipe-example"
      vertical
      :loop="false"
      :indicator="false"
      @change="handleSwipeChange"
    >
      <var-swipe-item
        v-for="video in videos"
        :key="video.id"
        class="video-swipe-item"
      >
        <VideoSwipeItem
          :active="activeVideoId === video.id"
          :video="video"
          @comment="handleViewComment"
        />
      </var-swipe-item>
    </var-swipe>

    <var-popup v-model:show="commentDialogVisible" :default-style="false" position="bottom">
      <CommentLayout
        v-if="!!currentVideo"
        :visible="commentDialogVisible"
        :video="currentVideo!"
      />
    </var-popup>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
