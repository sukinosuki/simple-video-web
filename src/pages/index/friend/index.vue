<route lang="yaml">
meta:
  layout: home2
          </route>

<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash.debounce'
import api from '~/api'
import type { API_User } from '~/api/user'
import type { User } from '~/type'
import { sleep, toCatch } from '~/utils'
import { toast } from '~/utils/toast'
import { PageStatus } from '~/type/enum'
import EmptyImg from '~/assets/empty.jpg'

interface LoadMoreStatus {
  isFinished: boolean
  loading: boolean
  data: User.Simple[]
  refreshing: boolean
  page: number
  pageStatus: PageStatus
}

const authStore = useAuthStore()
const size = 10
const users = ref<User.Simple[]>([])
const page = 1
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
  const params: API_User.GetAll = {
    // range: [0, 30],
    page,
    size,
  }
  const [err, res] = await toCatch(api.user.getAll(params))
  loadMoreStatus.refreshing = false
  if (err) {
    // pageStatus.value = PageStatus.FAILED
    loadMoreStatus.pageStatus = PageStatus.FAILED

    return
  }

  // if (page === 1 && !res.length)

  //   pageStatus.value = PageStatus.EMPTY

  // else
  //   pageStatus.value = PageStatus.LOADED
  // users.value = res
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

// 关注/取消关注
// TODO: 防抖
const handleToggleFollow = debounce(async (user: User.Simple, index: number) => {
  // const[err]=await toCatch(api.follow.)
// TODO: 不能关注自己
  if (authStore?.userProfile?.user?.id === user.id) {
    toast('不能关注自己')
    return
  }

  if (users.value[index]._loading === true)
    return

  users.value[index]._loading = true
  const fn = user.is_follow ? api.follow.unFollow : api.follow.follow

  await sleep()
  const [err] = await toCatch(fn(user.id))
  users.value[index]._loading = false

  if (err)
    return

  users.value[index].followers += user.is_follow ? -1 : 1
  users.value[index].is_follow = !user.is_follow
}, 300, {
  leading: true,
  trailing: false,
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="page">
    <AppBar title="用户" fixed />

    <VarPullRefresh
      v-model="loadMoreStatus.refreshing"
      :success-duration="1000"
      class="main"
      @refresh="fetchData"
    >
      <div class="main">
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
            <li v-for="(user, index) in loadMoreStatus.data" :key="user.id" class="rank-item">
              <img v-lazy="user.avatar" class="avatar">
              <div class="content">
                <span class="nickname">{{ user.nickname }}</span>
                <div class="base-statistic">
                  <span class="item offering-count">作品: {{ user.video_count }}</span>

                  <span class="item follower-count">粉丝: {{ user.followers }}</span>

                  <span class="item following-count">关注: {{ user.following_count }}</span>
                </div>
              </div>

              <VarButton
                :loading="user._loading" class="follow-button" :class="{ primary: !user.is_follow }" text size="small" @click="() => handleToggleFollow(user, index)"
              >
                {{ user.is_follow ? '取消关注' : '关注' }}
              </VarButton>
            </li>
          </VarList>
        </var-skeleton>
      </div>
    </VarPullRefresh>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
