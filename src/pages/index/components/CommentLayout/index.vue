<script setup lang="ts">
import CommentItem from '../CommentItem/index.vue'
import ReplyLayout from '../ReplyLayout/index.vue'
import CommentInputFooter from '../CommentInputFooter/index.vue'

import api from '~/api'
import type { API_Comment } from '~/api/comment'
import type { Comment, TabStatus } from '~/type'
import { MediaType, PageStatus } from '~/type/enum'
import type { Video } from '~/type/video'
import { sleep, toCatch } from '~/utils'

const props = defineProps<{
  video: Video.Res
  visible: boolean
}>()

interface ReplyStatus {
  placeholder: string
  targetComment: Comment.Simple | null
  dialogVisible: boolean
  confirmLoading: boolean
}

const commentStatus = reactive<TabStatus<Comment.Simple>>({
  data: [],
  refreshing: false,
  page: 1,
  pageStatus: PageStatus.LOADING,
  isFinished: false,
  loading: false,
})
const currentVideo = props.video
const replyStatus = reactive<ReplyStatus>({
  placeholder: '',
  targetComment: null,
  dialogVisible: false,
  confirmLoading: false,
})

const commentReplyDialogVisible = ref(false)

const targetRootComment = ref<Comment.Simple | null>(null)

const sendCommentLoading = ref(false)
//
const handleViewRootComment = (comment: Comment.Simple) => {
  commentReplyDialogVisible.value = true
  targetRootComment.value = comment
}

//
const loadComment = async (vid: number, isLoadMore = false) => {
  console.log('[loadComment]')

  if (isLoadMore)
    commentStatus.loading = true

  else
    commentStatus.pageStatus = PageStatus.LOADING

  const params: API_Comment.GetAll = {
    page: isLoadMore ? commentStatus.page + 1 : 1,
    size: 10, // TODO
    media_id: vid,
    media_type: MediaType.VIDEO, // TODO
  }

  await sleep(1000)
  const [err, res] = await toCatch(api.comment.getAll(params))
  commentStatus.loading = false

  if (err) {
    if (isLoadMore) {
      // TODO
      // commentStatus.pageStatus = PageStatus.FAILED
    }
    else {
      commentStatus.pageStatus = PageStatus.FAILED
    }
    return
  }

  if (isLoadMore) {
    commentStatus.data.push(...res)
  }

  else {
    commentStatus.data = res
    commentStatus.isFinished = res.length < 10
    commentStatus.pageStatus = !res.length ? PageStatus.EMPTY : PageStatus.LOADED
  }
}

//
const handleSendComment = async (_content: string): Promise<boolean> => {
  sendCommentLoading.value = true
  // TODO: 一级、二级评论
  const data: API_Comment.Add = {
    media_id: props.video.video.id,
    media_type: MediaType.VIDEO,
    content: _content,
  }
  await sleep()
  const [err, res] = await toCatch(api.comment.add(data))
  sendCommentLoading.value = false
  if (err) {
    //
    return false
  }

  commentStatus.data.unshift(res)
  commentStatus.pageStatus = PageStatus.LOADED

  // commentContent.value = ''

  return true
}

// 发起二级回复
const handleReply = async (_comment: Comment.Simple) => {
  replyStatus.placeholder = `回复@${_comment.user.nickname}`
  replyStatus.targetComment = _comment
  replyStatus.dialogVisible = true
}

// 提交二级回复
const handleSendReply = async (_content: string): Promise<boolean> => {
  const data: API_Comment.Add = {
    content: _content,
    media_id: props.video.video.id,
    media_type: MediaType.VIDEO,
    at_uid: replyStatus.targetComment?.uid,
    root: replyStatus.targetComment?.root || replyStatus.targetComment?.id,
    reply_id: replyStatus.targetComment?.id,
  }

  replyStatus.confirmLoading = true
  await sleep()
  const [err, res] = await toCatch(api.comment.add(data))
  replyStatus.confirmLoading = false
  if (err) {
    //
    return false
  }

  replyStatus.dialogVisible = false
  const index = commentStatus.data.findIndex(item => item.id === replyStatus.targetComment?.id)
  console.log('index ', index)

  if (index !== -1) {
    if (commentStatus.data[index].replies?.length)

      commentStatus.data[index].replies.unshift(res)

    else
      commentStatus.data[index].replies = [res]
  }

  return true
}

watchEffect(() => {
  if (props.visible) {
    loadComment(props.video.video.id)
  }
  else {
    //
  }
})
</script>

<template>
  <div class="comment-dialog-layout">
    <header class="header">
      <span>{{ currentVideo?.comment_count || 0 }} 条评论</span>
    </header>

    <div class="layout-content">
      <div v-if="commentStatus.pageStatus === PageStatus.LOADED">
        <ul class="comment-list">
          <template v-for="comment in commentStatus.data" :key="comment.id">
            <CommentItem
              :video="video"
              :show-replies="true"
              :comment="comment"
              @reply="handleReply"
              @view-root-comment="handleViewRootComment"
            />
          </template>
        </ul>

        <div class="layout-content-footer">
          <div v-if="commentStatus.isFinished" class="flex">
            <span>没有更多了</span>
          </div>
          <VarButton
            v-if="!commentStatus.isFinished"
            :loading="commentStatus.loading"
            class="w100 primary"
            @click="() => loadComment(currentVideo!.video.id, true)"
          >
            加载更多
          </VarButton>
        </div>
      </div>

      <div v-if="commentStatus.pageStatus === PageStatus.LOADING" class="flex loading">
        <VarLoading type="cube" />
      </div>

      <div v-if="commentStatus.pageStatus === PageStatus.EMPTY" class="flex empty">
        <span>暂无评论</span>
      </div>
    </div>

    <CommentInputFooter
      placeholder="期待你的评论"
      :confirm-loading="sendCommentLoading"
      @send="handleSendComment"
    />

    <VarPopup
      v-model:show="replyStatus.dialogVisible"
      :default-style="false"
      position="bottom"
    >
      <CommentInputFooter
        :placeholder="replyStatus.placeholder"
        :confirm-loading="replyStatus.confirmLoading"
        @send="handleSendReply"
      />
    </VarPopup>

    <VarPopup v-model:show="commentReplyDialogVisible" :default-style="false" position="bottom">
      <ReplyLayout
        v-if="!!targetRootComment"
        :visible="commentReplyDialogVisible"
        :root-comment="targetRootComment!"
        :video="video"
        @close="() => commentReplyDialogVisible = false"
      />
    </VarPopup>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
