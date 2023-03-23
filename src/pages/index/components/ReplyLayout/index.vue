<script setup lang="ts">
import CommentItem from '../CommentItem/index.vue'
import CommentInputFooter from '../CommentInputFooter/index.vue'
import api from '~/api'
import type { API_Comment } from '~/api/comment'
import type { Comment, TabStatus } from '~/type'
import { MediaType, PageStatus } from '~/type/enum'
import type { Video } from '~/type/video'
import { sleep, toCatch } from '~/utils'

const props = defineProps<{
  rootComment: Comment.Simple
  video: Video.Res
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
const sendCommentLoading = ref(false)
const commentReplyDialogVisible = ref(false)
const targetRootComment = ref<Comment.Simple | null>(null)
const tabStatus = reactive<TabStatus<Comment.Simple>>({
  isFinished: false,
  loading: false,
  data: [],
  refreshing: false,
  page: 1,
  pageStatus: PageStatus.LOADING,
})

//
const fetchData = async () => {
  tabStatus.pageStatus = PageStatus.LOADING
  const params: API_Comment.Get = {
    root_id: props.rootComment.id,
    media_id: props.video.video.id,
    media_type: MediaType.POST,
  }

  await sleep(1000)

  const [err, res] = await toCatch(api.comment.get(params))

  if (err) {
    tabStatus.pageStatus = PageStatus.FAILED
    return
  }

  tabStatus.pageStatus = PageStatus.LOADED
  console.log('res ', res)
  tabStatus.data.push(...res)
}

//
const handleSendComment = async (content: string) => {
  const data: API_Comment.Add = {
    content,
    media_id: props.video.video.id,
    media_type: MediaType.VIDEO,
    // at_uid?: number,
    root: props.rootComment.id,
    // reply_id?: number
  }
  const [err, res] = await toCatch(api.comment.add(data))
  if (err)
    return

  tabStatus.data.unshift(res)
}

const handleCloseDialog = () => {
  emit('close')
}

watchEffect(() => {
  if (props.visible)
    fetchData()
})
</script>

<template>
  <div class="reply-layout">
    <div class="header">
      <span class="title">评论详情</span>
      <VarButton class="close-button" size="small" text @click="handleCloseDialog">
        <VarIcon class="icon" size="2.4rem" name="window-close" />
      </VarButton>
    </div>

    <div class="root-comment">
      <CommentItem
        :show-replies="false"
        :video="video" :comment="rootComment"
      />
    </div>

    <div class="header-divider" />

    <div class="layout-content">
      <div class="reply-list">
        <template v-for="comment in tabStatus.data" :key="comment.id">
          <CommentItem :video="video" :comment="comment" />
        </template>
      </div>

      <div v-if="tabStatus.pageStatus === PageStatus.LOADING" class="loading flex">
        <VarLoading type="cube" />
      </div>
    </div>

    <CommentInputFooter placeholder="对xx发起回复" :confirm-loading="sendCommentLoading" @send="handleSendComment" />

    <!-- <VarPopup v-model:show="commentReplyDialogVisible" :default-style="false" position="bottom">
      <ReplyLayout
        v-if="!!targetRootComment"
        :visible="commentReplyDialogVisible"
        :root-comment="targetRootComment!"
        :video="video"
        @close="() => commentReplyDialogVisible = false"
      />
    </VarPopup> -->
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
