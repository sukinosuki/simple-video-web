<route lang="yaml">
meta:
  layout: home2
</route>

<script setup lang="ts">
import type { Form } from '@varlet/ui'
import { reactive } from 'vue'
import api from '~/api'
import type { API_Email } from '~/api/email'
import { EmailActionType } from '~/types/enum'
import { sleep, toCatch } from '~/utils'
import { toast } from '~/utils/toast'

interface LoginForm {
  email: string
  password: string
  code: string
}

defineOptions({
  name: 'LoginPage',
})

const form = reactive<LoginForm>({
  email: 'hanami@qq.com',
  password: '233233',
  code: '',
})

enum Action {
  LOGIN = 1,
  REGISTER = 2,
}
const user = useUserStore()

const action = ref(Action.LOGIN)
const confirmLoading = ref(false)
const sendEmailLoading = ref(false)

const formRef = ref<Form | null>(null)

const router = useRouter()

const authStore = useAuthStore()

const isLogin = computed(() => {
  return action.value === Action.LOGIN
})

//
const toggleAction = () => {
  // router.push('/register')
  if (action.value === Action.LOGIN)
    action.value = Action.REGISTER

  else
    action.value = Action.LOGIN
}

//
const handleSendEmail = async () => {
  console.log('user.otherNames ', user.otherNames)
  console.log('user.savedName ', user.savedName)

  user.setNewName(form.email)
  return
  // Snackbar.allowMultiple(true)

  // const loading = Snackbar.loading({
  //   content: '下在发送',
  //   position: 'center',
  // })
  sendEmailLoading.value = true
  const data: API_Email.Send = {
    email: form.email,
    action_type: EmailActionType.REGISTER,
  }
  const [err, res] = await toCatch(api.email.send(data))
  sendEmailLoading.value = false
  await sleep()
  // loading.clear()

  if (err)
    return

  toast('验证码已发送')
  form.code = res
}

const login = async () => {
  confirmLoading.value = true
  await sleep()

  const [err, res] = await toCatch(api.user.login(form))
  confirmLoading.value = false
  if (err) {
    // toast(err.message)
    return
  }
  console.log('res ', res)

  authStore.login(res)

  await toast('欢迎回来')
  console.log('router ', router)

  router.replace('/')
}
//
const register = async () => {
  confirmLoading.value = true
  await sleep()

  const [err, res] = await toCatch(api.user.register(form))
  confirmLoading.value = false

  if (err)
    return

  authStore.login(res)

  await toast('注册成功')
  router.replace('/')
}

// login
const handleSubmit = async () => {
  const validate = await formRef.value?.validate()
  if (!validate)
    return

  if (isLogin) {
    login()
    return
  }

  register()
}
</script>

<template>
  <div class="page login-page">
    <div v-if="authStore.isLogin">
      用户已登录
    </div>

    <div class="main">
      <div class="header">
        <h3 class="title">
          {{ action === Action.LOGIN ? '登录发现更多精彩' : '注册您的新账号' }}
        </h3>
        <p class="tip">
          请遵守抖音用户协议和隐私政策以及运营服务商协议，运营商户将对你提供的信息进行验证
        </p>
      </div>

      <VarForm ref="formRef" class="form-box">
        <VarInput
          v-model="form.email" :rules="[v => !!v || 'email不能为空']" :counter="30" type="text" placeholder="Email"
        />

        <VarInput v-model="form.password" :counter="12" placeholder="Password" />

        <div v-if="action === Action.REGISTER" class="flex">
          <VarInput v-model="form.code" placeholder="Email code" />
          <VarButton :loading="sendEmailLoading" class="primary shrink-0" size="small" @click="handleSendEmail">
            获取验证码
          </VarButton>
        </div>

        <VarButton
          :loading="confirmLoading"
          class="login-button" @click="handleSubmit"
        >
          {{ action === Action.LOGIN ? '登录' : '注册并登录' }}
        </VarButton>

        <div class="flex-end" style="margin-top: 1rem;">
          <var-button
            class="register-button"
            :hint="false"

            :line="false" size="mini" text @click="toggleAction"
          >
            {{ action === Action.LOGIN ? '没有账号? 注册账号' : '已有账号? 去登录' }}
          </var-button>
        </div>
      </VarForm>
    </div>
  </div>
</template>

<style lang="scss">
@import "./index.scss";
</style>
