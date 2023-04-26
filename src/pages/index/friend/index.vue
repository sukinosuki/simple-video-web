<route lang="yaml">
meta:
  layout: home2
          </route>

<script setup lang="ts">
import debounce from 'lodash.debounce'
import UserItem from './components/user-item/index.vue'
import api from '~/api'
import type { API_User } from '~/api/user'
import type { User } from '~/type'
import { toCatch } from '~/utils'
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
// const users = ref<User.Simple[]>([])
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
const handleToggleFollow = debounce(async (user: User.Simple) => {
  const index = loadMoreStatus.data.findIndex(item => item.user.id === user.user.id)

  // TODO: 不能关注自己
  if (authStore?.userProfile?.user?.id === user.user.id) {
    toast('不能关注自己')
    return
  }

  if (loadMoreStatus.data[index]._loading === true)
    return

  loadMoreStatus.data[index]._loading = true
  const fn = user.is_following ? api.follow.unFollow : api.follow.follow

  const [err] = await toCatch(fn(user.user.id))
  loadMoreStatus.data[index]._loading = false

  if (err)
    return

  loadMoreStatus.data[index].followers += user.is_following ? -1 : 1
  loadMoreStatus.data[index].is_following = !user.is_following
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
            <template v-for="(user, index) in loadMoreStatus.data" :key="index">
              <UserItem :user="user" @toggle-follow="handleToggleFollow" />
            </template>
          </VarList>
        </var-skeleton>
      </div>
    </VarPullRefresh>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
