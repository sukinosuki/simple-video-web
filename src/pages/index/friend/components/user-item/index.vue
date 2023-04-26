<script setup lang="ts">
import type { User } from '~/type'

const props = defineProps<{
  user: User.Simple
}>()

const emit = defineEmits<{
  (e: 'toggleFollow', user: User.Simple): void
}>()

const { user } = props

const handleToggleFollow = () => {
  emit('toggleFollow', user)
}
</script>

<template>
  <li :key="user.user.id" class="rank-item">
    <img v-lazy="user.user.avatar" class="avatar">
    <div class="content">
      <span class="nickname">{{ user.user.nickname }}</span>
      <div class="base-statistic">
        <span class="item offering-count">作品: {{ user.video_count }}</span>

        <span class="item follower-count">粉丝: {{ user.followers }}</span>

        <span class="item following-count">关注: {{ user.following_count }}</span>
      </div>
    </div>

    <VarButton
      :loading="user._loading" class="follow-button" :class="{ primary: !user.is_following }" text size="small" @click="handleToggleFollow"
    >
      {{ user.is_following ? '取消关注' : '关注' }}
    </VarButton>
  </li>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
