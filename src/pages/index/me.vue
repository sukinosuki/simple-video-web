<route lang="yaml">
meta:
  layout: home2
          </route>

<script setup lang="ts">
import api from '~/api'
import type User from '~/types/user'
import type { Video } from '~/types/video'
import { toCatch } from '~/utils'

const profile = ref<User.Profile>()

const videos = ref<Video.Simple[]>([])

const collections = ref<Video.Simple[]>([])
//
const fetchVideoCollection = async () => {
  const params = {
    page: 1,
    size: 3,
  }
  const [err, res] = await toCatch(api.collection.getAll(params))
  if (err)
    return

  console.log('res ', res)
  collections.value = res
}
//
const fetchUserVideo = async () => {
  const params = {
    page: 1,
    size: 3,
    uid: profile.value!.user.id,
  }
  const [err, res] = await toCatch(api.video.getAll(params))
  if (err)
    return

  console.log('res ', res)
  videos.value = res
}

//
const fetchProfile = async () => {
  const [err, res] = await toCatch(api.auth.getProfile())
  if (err)
    return

  profile.value = res
}

const tabActive = ref(0)

onMounted(() => {
  fetchProfile()
})

watchEffect(() => {
  if (profile.value) {
    console.log('用户登录 了')
    fetchUserVideo()
    fetchVideoCollection()
  }
})
</script>

<template>
  <div class="me-page">
    <div class="profile-wrap">
      <div class="flex-end">
        <VarButton>编辑个人资料</VarButton>
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
          {{ profile?.fans_count }} 关注
        </VarButton>
        <VarButton text>
          {{ profile?.fans_count }} 粉丝
        </VarButton>
      </div>
    </div>

    <VarTabs
      v-model:active="tabActive"
      color="transparent"
      active-color="var(--primary-color)"
      inactive-color="hsla(0, 0%, 100%, .6)"
    >
      <var-tab>作品 {{ profile?.video_count || 0 }}</var-tab>
      <var-tab>收藏 {{ profile?.collection_count || 0 }}</var-tab>
    </VarTabs>

    <VarTabsItems v-model:active="tabActive">
      <VarTabItem class="tab-item">
        <div class="video-list">
          <div v-for="video in videos" :key="video.id" v-ripple class="video-item ripple-example-block var-elevation--2">
            <img :src="video.cover" class="cover">
            <div class="item-content">
              <h2 class="title">
                {{ video.title }}
              </h2>
            </div>
          </div>
        </div>

        <VarButton class="w100 more-button" color="var(--primary-color)">
          查看更多
        </VarButton>
      </VarTabItem>

      <VarTabItem class="tab-item">
        <div class="video-list">
          <div v-for="video in collections" :key="video.id" v-ripple class="video-item ripple-example-block var-elevation--2">
            <img :src="video.cover" class="cover">
            <div class="item-content">
              <h2 class="title">
                {{ video.title }}
              </h2>
            </div>
          </div>
        </div>

        <VarButton class="more-button w100" color="var(--primary-color)">
          查看更多
        </VarButton>
      </VarTabItem>
    </VarTabsItems>
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  background-color: rgb(42, 40, 40);
  height: 100%;
  color: white;
}
.profile-wrap {

  padding: 1.2rem;
.username {
  font-size: 1.6rem;
}
.uid {
  font-size: 1.2rem;
}
.email{
  font-size: 1.4rem;
}

.user-profile-chip{
  margin-top: 1rem;
  .clip {
    background-color: var(--primary-color);
    margin-right: 1rem;
  }
}
}

.tab-item {
  padding: 1.2rem;

}

.video-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 1rem;

  .video-item {
    width: 32%;
    border-radius: 0.2rem;
    overflow: hidden;
    margin-bottom: 1rem;
    .cover {
      width: 100%;
      font-size: 0;
      height: 14rem;
      object-fit: cover;
    }

    .item-content {
      padding: 0.4rem;
      .title {
        font-size: 12px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }

  .more-button{
    width: 100%;
    // margin-top: 2rem;
  }
}

.ripple-example-block {
  user-select: none;
  cursor: pointer;
  color: #888;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: background-color 0.25s;
}
</style>
