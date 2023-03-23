<route lang="yaml">
meta:
  layout: empty
        </route>

<script setup lang="ts">
import type { Form, VarFile } from '@varlet/ui'
import api from '~/api'
import type { API_Auth } from '~/api/auth/auth'
import { Gender, UploadClass, UploadType } from '~/type/enum'
import { toCatch } from '~/utils'
import { appLoading, toast } from '~/utils/toast'

interface ProfileForm {
  nickname: string
  birthday?: string
  gender: Gender
  avatar: VarFile[]
}

const formRef = ref<Form>()

const form = reactive<ProfileForm>({
  nickname: '',
  gender: Gender.KEEP_SECRET,
  avatar: [],
  birthday: '',
})
const birthdayDatePickerVisible = ref(false)
const route = useRoute()
const router = useRouter()
const confirmLoading = ref(false)
//
const fetchData = async () => {
  const [err, res] = await toCatch(api.auth.getProfile())
  if (err)
    return

  form.avatar.push(
    {
      cover: res.user.avatar,
      url: res.user.avatar,
      state: 'success',
    },
  )
  form.birthday = res.user.birthday || ''
  form.nickname = res.user.nickname
  form.gender = res.user.gender
}

//
const init = async () => {
  fetchData()
}

//
const showDatePickerDialog = async () => {
  birthdayDatePickerVisible.value = true
}

//
const handleCoverAfterRead = async (file: VarFile) => {
  const loading = appLoading('正在上传')
  const formData = new FormData()
  formData.append('class', UploadClass.MomentVideoCover.toString())
  formData.append('type', UploadType.Picture.toString())
  formData.append('file', file.file!)

  // await sleep()

  const [err, res] = await toCatch(api.upload.upload(formData))
  if (err) {
    file.state = 'error'
    return
  }

  file.url = res
  file.cover = res
  file.state = 'success'

  // TODO?
  form.avatar = [file]

  loading.clear()
}

const handleSubmit = async () => {
  const validates = await formRef.value?.validate()
  if (!validates)
    return
  confirmLoading.value = true

  const data: API_Auth.UpdateProfile = {
    nickname: form.nickname,
    avatar: '' || form.avatar[0].url!,
    birthday: form.birthday || null,
    gender: form.gender,
  }
  const [err] = await toCatch(api.auth.updateProfile(data))
  confirmLoading.value = false

  if (err)
    return

  await toast('已更新')
  router.back()
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="page">
    <AppBar back :on-back="router.back" title="我的信息" />

    <main class="main">
      <div class="avatar-wrap">
        <div>
          <VarUploader
            v-model="form.avatar"
            accept="image/png,jpg,webp"
            class="uploader"
            hide-list
            @after-read="handleCoverAfterRead"
          >
            <div class="uploader-content">
              <img
                class="avatar-img"
                :src="form.avatar[0]?.cover"
              >
              <span class="text">上传头像</span>
            </div>
          </VarUploader>
        </div>
      </div>

      <VarForm ref="formRef">
        <VarInput
          v-model="form.nickname"
          placeholder="昵称"
          :counter="12"
          :maxlength="12"
          :rules="[v => !!v || '昵称不能为空']"
        />

        <VarSelect v-model="form.gender" class="mt1" placeholder="请选择性别">
          <VarOption label="保密" :value="Gender.KEEP_SECRET" />
          <VarOption label="男" :value="Gender.MALE" />
          <VarOption label="女" :value="Gender.FEMALE" />
        </VarSelect>

        <div @click="showDatePickerDialog">
          <VarInput v-model="form.birthday" class="mt1" disabled placeholder="生日" />
        </div>
      </VarForm>

      <VarButton class="w100 primary submit-button" @click="handleSubmit">
        更新
      </VarButton>
    </main>

    <VarDialog
      dialog-class="datepicker-dialog" :cancel-button="false" :show="birthdayDatePickerVisible"
      @confirm="() => birthdayDatePickerVisible = false"
    >
      <var-date-picker v-model="form.birthday" />
    </VarDialog>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
