<template>
  <ul class="list-group">
    <li
      v-for="item in deletes"
      :key="item.id"
      class="list-group-item d-flex align-item-center justify-content-between"
    >{{item.text}}</li>
  </ul>
  <button type="button" class="btn btn-danger float-right mt-4" @click="clear(TodoItemState.DELETE)">
    清除所有
  </button>
</template>

<script lang="ts">
// import store from '@/store'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
// import { TodoItemState } from '../common/const'
import { utils } from '@/common/utils'

export default defineComponent({
  setup () {
    // const clear = () => {
    //   store.commit('clear', TodoItemState.DELETE)
    // }
    // return {
    //   clear
    // }

    // 封装后的方法
    const { clear, TodoItemState } = utils()
    return {
      clear,
      TodoItemState
    }
  },
  computed: {
    ...mapGetters(['deletes'])
  }
})
</script>

<style scoped>
</style>
