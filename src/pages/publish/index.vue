<route lang="yaml">
meta:
  layout: empty
  requireAuth: true
        </route>

<script setup lang="ts">
import type { Form, VarFile } from '@varlet/ui'
import { Snackbar } from '@varlet/ui'
import api from '~/api'
import type { API_Video } from '~/api/video'
import { UploadClass, UploadType } from '~/types/enum'
import { sleep, toCatch } from '~/utils'
import { appLoading, toast } from '~/utils/toast'

interface PublishForm {
  title: string
  coverFiles: VarFile[]
  videoFiles: VarFile[]
}

const confirmLoading = ref(false)
const router = useRouter()
const formRef = ref<Form>()
const form = reactive<PublishForm>({
  title: '',
  coverFiles: [],
  videoFiles: [],
})

// publish
const handlePublish = async () => {
  const validated = await formRef.value?.validate()
  if (!validated)
    return

  const data: API_Video.Add = {
    url: form.videoFiles[0]!.url!,
    cover: form.coverFiles[0]!.cover!,
    title: form.title,
  }

  const loading = appLoading('正在发布')
  confirmLoading.value = true
  const [err] = await toCatch(api.video.add(data))
  confirmLoading.value = false
  loading.clear()

  if (err)
    return

  await toast('发布成功')
}

//
function handleBeforeRead(file: VarFile) {
  if (file.file!.size <= 5 * 1024 * 1024) {
    // Snackbar.success({
    //   content: '文件小于5M，上传成功',
    //   position: 'center',
    // })
    return true
  }

  else {
    Snackbar.warning({
      content: '文件大于5M，不能上传',
      position: 'center',
    })
    return false
  }
}

const handleCoverAfterRead = async (file: VarFile) => {
  const loading = appLoading('正在上传')
  const formData = new FormData()
  formData.append('class', UploadClass.MomentVideoCover.toString())
  formData.append('type', UploadType.Picture.toString())
  formData.append('file', file.file!)

  await sleep()

  const [err, res] = await toCatch(api.upload.upload(formData))
  if (err) {
    file.state = 'error'
    return
  }

  file.url = res
  file.cover = res
  file.state = 'success'
  loading.clear()
}

//
const handleVideoAfterRead = async (file: VarFile) => {
  const loading = appLoading('正在上传')
  const formData = new FormData()
  formData.append('class', UploadClass.MomentVideo.toString())
  formData.append('type', UploadType.Video.toString())
  formData.append('file', file.file!)

  await sleep()

  const [err, res] = await toCatch(api.upload.upload(formData))
  if (err) {
    file.state = 'error'
    return
  }

  file.url = res
  file.cover = `${res}?x-oss-process=video/snapshot,t_8000,f_jpg,m_fast`
  file.state = 'success'
  loading.clear()
}
</script>

<template>
  <div class="publish-page">
    <AppBar title="发布" back :on-back="router.back" />

    <main class="main">
      <VarForm ref="formRef">
        <div class="form-item title">
          <label class="label">标题</label>
          <div class="item-content">
            <VarInput
              v-model="form.title"
              :rules="[v => !!v || '标题不能为空']" class="input" :maxlength="50"
            />
          </div>
        </div>

        <div class="form-item">
          <label class="label">封面</label>
          <div class="item-content">
            <var-uploader
              v-model="form.coverFiles"
              :maxlength="1"
              :rules="[v => (v.length >= 1 && v[0].state === 'success') || '请上传封面']"
              @before-read="handleBeforeRead"
              @after-read="handleCoverAfterRead"
            />
          </div>
        </div>

        <div class="form-item">
          <label class="label">视频</label>
          <div class="item-content">
            <var-uploader
              v-model="form.videoFiles"
              :maxlength="1"
              :rules="[v => (v.length >= 1 && v[0].state === 'success') || '请上传视频']"
              accept="video/mp4"
              @before-read="handleBeforeRead"
              @after-read="handleVideoAfterRead"
            />
          </div>
        </div>

        <div class="footer">
          <VarButton :confirm-loading="confirmLoading" class="w100 primary" @click="handlePublish">
            发布
          </VarButton>
        </div>
      </VarForm>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
