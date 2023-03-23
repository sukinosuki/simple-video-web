<script lang="ts" setup>
const props = defineProps<{
  placeholder: string
  confirmLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string): Promise<boolean>
}>()

const content = ref('')

const handleSend = async () => {
  const res = await emit('send', content.value)
  console.log('[handleSend] res ', res)

  // if (res)
  content.value = ''
}
</script>

<template>
  <footer class="comment-input-footer">
    <div class="content">
      <input
        v-model="content"
        rows="3"
        :placeholder="placeholder"
        class="input"
        textarea
      >
    </div>

    <VarButton
      :loading="confirmLoading"
      text
      class="send-icon"
      @click="handleSend"
    >
      <VarIcon name="white-balance-sunny" />
    </VarButton>
  </footer>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
