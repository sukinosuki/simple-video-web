<route lang="yaml">
meta:
  layout: empty
  keep-alive: true
          </route>

<script setup lang="ts">
import api from '~/api'
import type { API_Collection } from '~/api/auth/collection'
import type { Auth } from '~/type/auth'
import type { Video } from '~/type/video'
import { toCatch } from '~/utils'

const profile = ref<Auth.Profile>()

const videos = ref<Video.Simple[]>([])

const collections = ref<Video.Simple[]>([])
const router = useRouter()
const authStore = useAuthStore()

//
const toMyVideoCollectionPage = () => {
  router.push({
    path: `/user/${authStore.userProfile.user.id}/collection`,
  })
}

const toUserVideoPage = () => {
  router.push({
    path: `/user/${authStore.userProfile.user.id}/video`,
  })
}

//
const fetchVideoCollection = async () => {
  const params: API_Collection.GetAll = {
    page: 1,
    size: 3,
    // uid: profile.value!.user.id, // TODO
  }
  const [err, res] = await toCatch(api.collection.getAll(profile.value!.user.id, params))
  if (err)
    return

  collections.value = res
}

//
const fetchUserVideo = async () => {
  const params = {
    page: 1,
    size: 3,
    // uid: profile.value!.user.id,
  }
  const [err, res] = await toCatch(api.video.authAll(params))
  if (err)
    return

  videos.value = res
}

//
const fetchProfile = async () => {
  const [err, res] = await toCatch(api.auth.getProfile())
  if (err)
    return

  profile.value = res

  authStore.setProfile(res)
}

const tabActive = ref(0)

const toLoginPage = () => {
  router.push({
    path: '/login',
  })
}

const toProfilePage = () => {
  router.push({
    path: `/user/${authStore.userProfile.user.id}/profile`,
  })
}

onMounted(() => {
  console.log('me page mounted, isLogin: ', authStore.isLogin)

  if (authStore.isLogin)

    fetchProfile()
})

watchEffect(() => {
  if (profile.value) {
    fetchUserVideo()
    fetchVideoCollection()
  }
})
</script>

<template>
  <div class="me-page">
    <template v-if="authStore.isLogin">
      <div class="profile-wrap">
        <div class="flex-end">
          <VarButton @click="toProfilePage">
            编辑个人资料
          </VarButton>
        </div>

        <div>
          <h3 class="username">
            {{ profile?.user.nickname }}
          </h3>
          <p class="uid">
            uid: {{ profile?.user.id }}
          </p>
          <p class="email">
            email: {{ profile?.user.email }}
          </p>
        </div>

        <div class="user-profile-chip">
          <VarChip class="clip" size="small">
            广西
          </VarChip>
        </div>

        <div class="flex">
          <VarButton text>
            0 获赞
          </VarButton>
          <VarButton text>
            {{ profile?.following_count }} 关注
          </VarButton>
          <VarButton text>
            {{ profile?.follower_count }} 粉丝
          </VarButton>
        </div>
      </div>

      <VarTabs
        v-model:active="tabActive"
        color="transparent"
        active-color="var(--primary-color)"
        inactive-color="#999"
      >
        <var-tab>作品 {{ profile?.video_count || 0 }}</var-tab>
        <var-tab>收藏 {{ profile?.collection_count || 0 }}</var-tab>
      </VarTabs>

      <VarTabsItems v-model:active="tabActive">
        <VarTabItem class="tab-item">
          <div class="video-list">
            <div v-for="video in videos" :key="video.id" v-ripple class="video-item">
              <img v-lazy="`${video.cover}?x-oss-process=image/auto-orient,1/resize,m_fill,w_220,h_280/quality,q_90`" class="cover">
              <div class="item-content">
                <h2 class="title">
                  {{ video.title }}
                </h2>
              </div>
            </div>
          </div>

          <VarButton
            class="w100 primary"
            color="var(--primary-color)"
            @click="toUserVideoPage"
          >
            查看更多
          </VarButton>
        </VarTabItem>

        <VarTabItem class="tab-item">
          <div class="video-list">
            <div v-for="video in collections" :key="video.id" v-ripple class="video-item">
              <img v-lazy="`${video.cover}?x-oss-process=image/auto-orient,1/resize,m_fill,w_220,h_280/quality,q_90`" class="cover">
              <div class="item-content">
                <h2 class="title">
                  {{ video.title }}
                </h2>
              </div>
            </div>
          </div>

          <VarButton class="primary w100" color="var(--primary-color)" @click="toMyVideoCollectionPage">
            查看更多
          </VarButton>
        </VarTabItem>
      </VarTabsItems>
    </template>

    <template v-if="!authStore.isLogin">
      <div class="login-tip-box">
        <span class="text">你还没有登录</span>
        <VarButton class="w100 primary button" @click="toLoginPage">
          去登录
        </VarButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
