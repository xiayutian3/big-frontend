<template>
  <div class="container">
    <div class="form-group">
      <label for="">内容</label>
      <input type="text" class="form-control" v-model="newItem.text">
      <div class="float-right mt-4">
        <button class="btn btn-success mr-4" @click="submit">保存</button>
          <button class="btn btn-secondary" @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import store from '@/store'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup () {
    const item = store.state.item
    const newItem = { ...item }

    const submit = () => {
      store.commit('update', newItem)
      router.go(-1)
    }
    const cancel = () => {
      router.go(-1)
    }

    return reactive({ // reactive让里边的数据变成响应式
      newItem,
      submit,
      cancel
    })
  }
})
</script>

<style scoped>

</style>
