<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Comment } from '~/type'
import type { Video } from '~/type/video'

const props = defineProps<{
  video: Video.Res
  comment: Comment.Simple
  showReplies?: boolean
}>()

const emit = defineEmits<{
  (e: 'reply', comment: Comment.Simple): void
  (e: 'viewRootComment', comment: Comment.Simple): void
}>()

const handleReply = () => {
  emit('reply', props.comment)
}

const viewRootComment = () => {
  emit('viewRootComment', props.comment)
}

const isShowReplies = computed(() => {
  return !(props.showReplies === false)
})
console.log('props.showReplies ', props.showReplies)
console.log('isShowReplies ', isShowReplies.value)

const isUp = computed(() => {
  return props.video?.video.uid === props.comment.uid
})
</script>

<template>
  <div class="comment-item">
    <div class="item-content">
      <div class="item-left">
        <div class="avatar">
          <img :src="comment.user.avatar" class="img" alt="">
        </div>
      </div>

      <div class="item-right">
        <div class="item-right-content">
          <div>
            <span class="username">{{ comment.user.nickname }}</span>
            <span v-if="isUp" class="up-tag">UP</span>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>

          <div class="footer">
            <div class="flex-1">
              <span class="date">{{ dayjs(comment.created_at).format('MM-DD') }}</span>

              <VarButton size="mini" class="reply-button" text @click="handleReply">
                回复
              </VarButton>
            </div>

            <div>
              <VarButton class="action-icon" size="mini" text>
                <VarIcon name="heart-outline" size="16" />
                <span class="num">233</span>
              </VarButton>
            </div>
          </div>
        </div>

        <div v-if="isShowReplies && comment.replies?.length" class="replies" @click="viewRootComment">
          <ul class="reply-list">
            <li v-for="reply in comment.replies" :key="reply.id" v-ripple class="reply-item ">
              <span class="username">{{ reply.user.nickname }}</span>
              <span v-if="video?.video?.user?.id === reply.id" class="up-tag">UP</span>
              <span class="colon">:</span>
              <span class="comment-content">{{ reply.content }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
