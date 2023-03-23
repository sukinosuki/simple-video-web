<script setup lang="ts">
import { defineEmits } from 'vue'

import type { Video } from '~/type/video'

const props = defineProps<{
  video: Video.Simple
}>()

const emit = defineEmits<{
  (e: 'cancelCollect', video: Video.Simple): void
}>()

const menuVisible = ref(false)

const video = props.video
const cover = `${video.cover}?x-oss-process=image/auto-orient,1/resize,m_fill,w_140,h_80/quality,q_90`
console.log('render ')

//
const handleCancelCollect = () => {
  menuVisible.value = false
  emit('cancelCollect', video)
}
</script>

<template>
  <li :key="video.id" class="item">
    <div class="cover">
      <img v-lazy="cover" class="image" alt="">
    </div>

    <div class="item-content">
      <h3 class="title">
        {{ video.title || '-' }}
      </h3>

      <div class="content-main">
        <div class="up-wrap">
          <span class="up-tag">UP</span>
          <h3 class="up">
            {{ video.user.nickname }}
          </h3>
        </div>
      </div>

      <div class="footer">
        <div class="flex-start flex-1">
          <div class="icon-item">
            <VarIcon class="icon" name="play-circle-outline" />
            <span class="num">1.2万</span>
          </div>

          <div class="icon-item">
            <VarIcon class="icon" name="message-text-outline" />
            <span class="num">233</span>
          </div>
        </div>

        <VarMenu v-model:show="menuVisible">
          <VarButton text size="mini">
            <var-icon size="1.6rem" name="dots-vertical" />
          </VarButton>

          <template #menu>
            <var-cell v-ripple @click="handleCancelCollect">
              取消收藏
            </var-cell>
          </template>
        </VarMenu>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
