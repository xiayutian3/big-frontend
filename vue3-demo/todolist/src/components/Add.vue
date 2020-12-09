<template>
  <div class="form-group">
    <label for="">添加代办事项</label>{{inputValue}}
    <div class="row">
      <div class="col-8">
        <input type="text" v-model="inputValue" class="form-control" @keydown.enter="add">
      </div>
      <div class="col-4">
        <select class="form-control">
          <option value="">选择已过滤</option>
          <option value="">代办中</option>
          <option value="">已完成</option>
          <option value="">已删除</option>
        </select>
      </div>
    </div>
    <small class="form-text text-muted">回车即可加入</small>
  </div>
  <div class="list-group">
    <li class="list-group-item" v-for="item in todos" :key="item.id">{{item}}</li>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { computed, defineComponent, ref } from 'vue'
// import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup () {
    const inputValue = ref('')

    const add = () => {
      console.log(inputValue.value)
      // 更新vuex
      store.commit('add', inputValue.value)
      // 重置
      inputValue.value = ''
    }

    // return reactive({   //都可以
    //   inputValue
    // })
    return {
      inputValue,
      add,
      todos: computed(() => store.state.todos)
    }
  }
})
</script>

<style scoped>

</style>
